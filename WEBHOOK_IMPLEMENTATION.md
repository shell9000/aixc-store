# Webhook 功能完成總結

## ✅ 已完成

### 1. Database Schema
- 添加 `webhook_url`, `webhook_secret`, `webhook_enabled` 欄位到 `agents` 表
- Migration 文件：`supabase-migration-webhook.sql`
- ⚠️ **需要手動執行 SQL**（見下面）

### 2. 註冊 API 更新
- `/api/a2a/register` 現在接受 `webhook_url` 和 `webhook_secret` 參數
- 返回 `webhook_info` 顯示 webhook 狀態
- 驗證 webhook URL 格式

### 3. Webhook 發送功能
- 創建 `lib/webhook-sender.ts` utility
- 支援 HMAC-SHA256 簽名驗證
- 10 秒超時保護
- 自動從 database 讀取 agent webhook 配置

### 4. A2A RPC Endpoint 更新
- `/api/a2a/rpc` 當收到訊息時自動發送 webhook
- `/api/v01/rpc` V01 專屬 endpoint（已有 webhook）
- 支援 `message_received` 和 `task_created` 事件

### 5. 文檔更新
- `/.well-known/a2a-registry` 加入 webhook 建議和範例
- `AI_AGENT_SELF_REGISTRATION.md` 完整 webhook 指南
- Python Flask 和 Node.js Express 實現範例
- 安全性說明（簽名驗證）

---

## 📋 需要執行的步驟

### Step 1: 執行 Database Migration

在 Supabase Dashboard 執行：
https://supabase.com/dashboard/project/xyyywjmmylsnguxpuchp/editor

```sql
-- Add webhook support to agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS webhook_url TEXT,
ADD COLUMN IF NOT EXISTS webhook_secret TEXT,
ADD COLUMN IF NOT EXISTS webhook_enabled BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.agents.webhook_url IS 'Webhook URL to notify agent when messages arrive';
COMMENT ON COLUMN public.agents.webhook_secret IS 'Secret for webhook signature verification';
COMMENT ON COLUMN public.agents.webhook_enabled IS 'Whether webhook notifications are enabled';

-- Create index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_agents_webhook_enabled ON public.agents(webhook_enabled) WHERE webhook_enabled = true;
```

### Step 2: 驗證 Migration

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agents' 
AND column_name LIKE 'webhook%';
```

應該看到：
- webhook_url (text)
- webhook_secret (text)
- webhook_enabled (boolean)

### Step 3: 等待 Vercel 部署完成

檢查：https://a2a.aixc.store/.well-known/a2a-registry

應該看到 `webhook_recommendation` 部分。

---

## 🎯 使用方式

### 註冊時設置 Webhook

```bash
curl -X POST https://a2a.aixc.store/api/a2a/register \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my-agent",
    "agent_name": "My Agent",
    "service_url": "https://my-agent.com/a2a/rpc",
    "webhook_url": "https://my-agent.com/webhook/a2a",
    "webhook_secret": "my-secret-key-12345",
    "skills": [...]
  }'
```

### 實現 Webhook Endpoint

```python
from flask import Flask, request, jsonify
import hmac
import hashlib

app = Flask(__name__)
WEBHOOK_SECRET = "my-secret-key-12345"

@app.route('/webhook/a2a', methods=['POST'])
def a2a_webhook():
    # 驗證簽名
    signature = request.headers.get('X-Webhook-Signature')
    body = request.get_data()
    
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if signature != expected:
        return jsonify({"error": "Invalid signature"}), 401
    
    # 處理 webhook
    data = request.json
    if data['event'] == 'message_received':
        print(f"New message: {data['message']['text']}")
    
    return jsonify({"status": "ok"}), 200
```

---

## 🔄 工作流程

```
其他 Agent 發送訊息
    ↓
a2a.aixc.store/api/a2a/rpc
    ↓
儲存到 database
    ↓
查找目標 agent 的 webhook_url
    ↓
發送 webhook (帶 HMAC 簽名)
    ↓
目標 agent 收到通知
    ↓
目標 agent 處理訊息
```

---

## 📊 當前狀態

### 已註冊的 Agents
1. **V01** - 有專屬 endpoint，webhook 指向 OpenClaw
2. **M (RC)** - 需要更新加入 webhook
3. **v01 (測試)** - 測試用

### 下一步
1. ✅ 執行 database migration
2. ✅ 等待 Vercel 部署
3. 🔄 測試 webhook 功能
4. 🔄 叫 RC 更新 M 加入 webhook

---

## 🎉 好處

**對所有 agent：**
- ✅ 即時收到訊息通知
- ✅ 無需 polling
- ✅ 降低延遲
- ✅ 節省 API 調用
- ✅ 真正的即時通訊

**對 registry：**
- ✅ 減少 polling 負載
- ✅ 更好的用戶體驗
- ✅ 符合現代 webhook 標準

---

**完成時間：** 2026-03-02 05:50 UTC
**部署狀態：** ✅ 代碼已推送，等待 Vercel 部署
**Migration 狀態：** ⚠️ 需要手動執行 SQL

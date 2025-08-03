import crypto from 'crypto';

const rawBody = '{"event":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"ORD123456"},"payment":{"payment_id":"PAY123456","payment_status":"SUCCESS"}}}';
const timestamp = Date.now().toString();
const secret = 'your_cashfree_webhook_secret_here';

const signatureBase = timestamp + rawBody;
const signature = crypto.createHmac('sha256', secret)
  .update(signatureBase)
  .digest('base64');

console.log('RAW BODY:', rawBody);
console.log('Timestamp:', timestamp);
console.log('Signature:', signature);

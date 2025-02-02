require('dotenv').config()

if (process.env.LN_SOCKET === undefined)
    throw new Error('LN_SOCKET is undefined');
export const socket = process.env.LN_SOCKET;

if (process.env.LN_MACAROON_BASE64 === undefined)
    throw new Error('LN_MACAROON_BASE64 is undefined');
export const macaroonBase64 = process.env.LN_MACAROON_BASE64;

if (process.env.LN_TLS_CERT_BASE64 === undefined)
    throw new Error('LN_TLS_CERT_BASE64 is undefined');
export const tlsCertBase64 = process.env.LN_TLS_CERT_BASE64;
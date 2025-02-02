require('dotenv').config()

if (process.env.XRPL_SEED === undefined)
    throw new Error('XRPL_SEED is undefined');
export const seed = process.env.XRPL_SEED;
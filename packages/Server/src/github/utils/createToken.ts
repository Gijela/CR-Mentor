import jwt from 'jsonwebtoken';
import { get, post } from '../../../utils/request';
import dotenv from 'dotenv';

dotenv.config();

interface Installation {
  id: number;
  account: { node_id: string }
}

const appId = process.env.GITHUB_APP_ID || '';
const privateKey = process.env.GITHUB_PRIVATE_KEY || '';

export async function createToken(userName: string): Promise<string> {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    iss: appId,
  };

  const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  const { id: installationId, account: { node_id } } = await get<Installation>(
    `https://api.github.com/users/${userName}/installation`,
    null,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  const access_tokens_url = `https://api.github.com/app/installations/${installationId}/access_tokens`
  const { token } = await post<{ token: string }>(access_tokens_url, null, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return token;
}

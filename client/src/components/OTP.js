import React, { useCallback, useState } from "react";
import Input from "./Input";

export default function OneTimePassword({
  enabled,
  verificationCode,
  setVerificationCode,
  token,
}) {
  const [invalidCode, setInvalidCode] = useState(false);

  return (
    <div>
      {token && (
        <div>
          <p>Scan the QR code on your authenticator app</p>
          <img
            src={`http://localhost:3001/api/mfa_qr_code?authorization=${token}`}
          />
        </div>
      )}

      <Input
        id="verificationCode"
        label="Verification code"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />

      <button type="submit">Confirm</button>

      {invalidCode && <p>Invalid verification code</p>}
    </div>
  );
}

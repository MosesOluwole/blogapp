import React, { useState, useEffect, useCallback } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardFooter,
  MDBValidation,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { verifyOtp } from "../redux/features/authSlice";
import OneTimePassword from "../components/OTP";
// import { GoogleLogin } from "react-google-login";

const initialState = {
  email: "",
  password: "",
};

const Otp = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [formValue, setFormValue] = useState(initialState);
  const { loading, error, mfaEnabled, user } = useSelector((state) => ({
    ...state.auth,
  }));
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("profile")) {
      setToken(JSON.parse(localStorage.getItem("profile")).token);
    }
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(verifyOtp({ code: verificationCode, navigate, toast }));
    },
    [verificationCode]
  );
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  // const devEnv = process.env.NODE_ENV !== "production";

  // const googleSuccess = (resp) => {
  //   const email = resp?.profileObj?.email;
  //   const name = resp?.profileObj?.name;
  //   const token = resp?.tokenId;
  //   const googleId = resp?.googleId;
  //   const result = { email, name, token, googleId };
  //   dispatch(googleSignIn({ result, navigate, toast }));
  // };
  // const googleFailure = (error) => {
  //   toast.error(error);
  // };
  console.log({ user, mfaEnabled });
  return (
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
    >
      <MDBCard alignment="center">
        <MDBIcon fas icon="user-circle" className="fa-2x" />
        <h5>Sign In</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} noValidate className="row g-3">
            <OneTimePassword
              enabled={true}
              setVerificationCode={setVerificationCode}
              verificationCode={verificationCode}
              token={token}
            />
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};
export default Otp;

import React, { useEffect, useState, useContext } from "react";
import { mutate } from "swr";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import api from "apis/api";
import { AuthContext } from "components/auth/Auth";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const history = useNavigate();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  if (!token) history.push("/");

  useEffect(() => {
    const verifytoken = async () => {
      try {
        await api.open.post(
          "/users/verifyemail",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        await mutate(`/users/${user?.id}`, (state) => ({
          ...state,
          emailVerified: true
        }));
        setVerifying(false);
        history.push("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [history, token, user]);

  return (
    <Layout>
      <div className="container py-5">
        <ErrorMessage error={error} />
        <Loader loading={isVerifying} />
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;

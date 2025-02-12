import React, { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/api";
import Modal from "components/Modal";
import AddressFormSwap from "./AddressFormSwap";

const AddressModalSwap = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useNavigate();
  const location = useLocation();
  const heading = "Swap BTC Address";
  const submitText = "Swap";

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post(`/address/${id}/swap`, values);
      await mutate(`/users/${user.id}/address`);
      modalActions.onDismiss();
    } catch (e) {
      console.log(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    history.push(base);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Alert variant="primary">
            Replace an existing address with a new address.
          </Alert>
          <AddressFormSwap
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText={submitText}
          />
        </>
      )}
    </Modal>
  );
};

export default AddressModalSwap;

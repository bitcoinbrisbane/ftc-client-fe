import React, { useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import useSWR, { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/api";
import AddressForm from "./AddressForm";
import Modal from "components/Modal";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const addressFormAlert = (
  <div>
    <b className="alert-heading">
      Your payment can be sent to multiple bitcoin addresses.
    </b>
    <span className="ml-2">
      For example, you may want to split your payment and send 50% to a cold
      storage wallet and 50% to a hot wallet. Please set the percentage required
      in the below field or leave at 100.
    </span>
  </div>
);

const AddressModalForm = () => {
  let id = parseInt(useParams().id);
  const location = useLocation();
  const history = useNavigate();
  const isEditForm = !!id;
  const heading = isEditForm ? "Edit Address" : "Add Address";
  const submitText = isEditForm ? "Save" : "Add Address";
  const method = isEditForm ? "put" : "post";
  const url = isEditForm ? `/addresses/${id}` : "/address";
  const { data, error, isValidating } = useSWR(id && url);
  const isLoading = id && isValidating;
  const { user } = useContext(AuthContext);

  const parseSubmitValues = (id, v) => {
    const values = { ...v, userID: user?.id, percent: Number(v.percent) };
    return values;
  };

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const v = parseSubmitValues(id, values);
      await gpib.secure[method](url, v);
      // TODO: check replace function when editing address
      const add = (ads) => [...ads, { id: Math.random(), ...v, ...data }];
      const replace = (ads) => ads.map((t) => (t.id !== id ? t : v));
      mutate("/transfer", id ? replace : add);
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
    <Modal isOpen onDismiss={onDismiss} heading={heading} large>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isLoading} diameter="2rem" />
          <ErrorMessage error={error} />
          {error ? (
            <Button
              onClick={onDismiss}
              variant="secondary"
              block
              children="Close"
            />
          ) : (
            <AddressForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={data}
              submitText={submitText}
              alert={addressFormAlert}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalForm;

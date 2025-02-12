import React, { useContext } from "react";
import Modal from "components/Modal";
import AddressGroupForm from "./AddressGroupForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import gpib from "apis/api";
import { AuthContext } from "components/auth/Auth";

const AddressGroupModal = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const history = useNavigate();
  const heading = "Set Group Address";
  const { data: address } = useSWR(`/address/${id}`);
  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    history.push(base);
  };

  const onSubmit = async (values, formActions, modalActions) => {
    formActions.setSubmitting(true);
    try {
      await gpib.secure.put(`/address/group/${id}`, values);
      await mutate(`/users/${user.id}/address`);
      modalActions.onDismiss();
    } catch (error) {
      console.log(error);
      formActions.setErrors({ hidden: error });
    }
    formActions.setSubmitting(false);
  };
  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <AddressGroupForm
          onDismiss={onDismiss}
          onSubmit={wrapCallback(onSubmit)}
          initialValues={address}
        />
      )}
    </Modal>
  );
};

export default AddressGroupModal;

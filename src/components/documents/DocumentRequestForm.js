import React, { useContext } from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import api from "apis/api";
import ErrorMessage from "components/ErrorMessage";
import { useNavigate } from "react-router-dom";
import "./DocumentRequestForm.scss";

const defaultValues = {
	date: "",
	summary: ""
};

const parseSubmitValues = (v) => ({
	date: v.date,
	summary: v.summary
});

const validate = ({ date, notes }) => {
	const requiredMsg = "This field is required";
	const errors = {};

	return errors;
};

const DocumentRequestForm = ({ initialValues: _iv }) => {
	const initialValues = { ...defaultValues, ..._iv };
	const history = useNavigate();
	const onSubmit = async (values, actions) => {
		try {
			const parsedValues = parseSubmitValues(values);
			await api.open.post("/documents", parsedValues);
			history.push("/");
		} catch (e) {
			console.log(e);
			actions.setErrors({ hidden: e });
			actions.setSubmitting(false);
		}
	};

	return (
		<Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
			{({ isSubmitting, errors }) => (
				<Form style={{ flex: 1, width: "100%" }}>
					<Input name="date" label="Document date if applicable" placeholder="2023/01/01" disabled={initialValues?.date} />
					<Input name="notes" label="Notes" placeholder="" disabled={initialValues?.notes} />
					<ErrorMessage error={errors.hidden} />
					<SubmitSpinnerButton submitText="Upload a document" isSubmitting={isSubmitting} />
					<SubmitSpinnerButton submitText="Submit" isSubmitting={isSubmitting} />
				</Form>
			)}
		</Formik>
	);
};

export default DocumentRequestForm;

export const setErrorsForm = (form: any, errors: any) => {
  Object.keys(errors).forEach((prop) => {
    const formControl = form.get(prop);
    if (formControl && errors[prop].length) {
      // activate the error message
      formControl.enable();
      formControl.markAsTouched();
      formControl.setErrors({
        serverError: errors[prop][0],
      });
    }
  });
};
import { useState } from "react";

const useForm = (initialValue) => {
  const [form, setForm] = useState(initialValue);

  // handle field change automatically
  const handleFieldChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  // set property manually
  const setFormProperty = (property, value) => {
    setForm({ ...form, [property]: value });
  };

  return {
    form,
    handleFieldChange,
    setFormProperty,
  };
};

export default useForm;

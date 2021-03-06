import React, { useState } from "react";
import { useRouter } from "next/router";
import { Rating } from "@mui/material";
import { beerTypes, servingTypes } from "../utils/dataTypes";
import getFormattedDate from "../utils/getFormattedDate";
import useForm from "../hooks/form";
import { createBeer, editBeer } from "../services/beer";
import Dropdown from "./Dropdown";
import CategoryGroup from "./CategoryGroup";
import ImageCropAndUpload from "./ImageCropAndUpload";
import Input from "./Input";
import styles from "../styles/components/BeerForm.module.scss";

const BeerForm = ({ setError, editValues }) => {
  const router = useRouter();

  // form field data states
  const { form, handleFieldChange, setFormProperty } = editValues
    ? useForm(editValues)
    : useForm({
        name: "",
        brewer: "",
        rating: 0,
        beerType: null,
        servingType: null,
        abv: "",
        ibu: "",
        notes: "",
        date: getFormattedDate(),
        imageUrl: null,
      });

  // form state
  const [beerTypeVisible, setBeerTypeVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    imageUrl: null,
    name: null,
    brewer: null,
    rating: null,
    abv: null,
    ibu: null,
    date: null,
  });

  const setImage = (url) => {
    setFormProperty("imageUrl", url);
  };

  const handleRatingChange = (e, value) => {
    setFormProperty("rating", value);
  };

  const toggleBeerTypeVisibility = (e) => {
    e.preventDefault();
    setBeerTypeVisible(!beerTypeVisible);
  };

  const toggleBeerType = (value) => {
    if (form.beerType === value) {
      setFormProperty("beerType", null);
    } else {
      setFormProperty("beerType", value);
    }
  };

  const beerTypeMap = beerTypes.reduce(
    (o, t) => ({ ...o, [t]: () => toggleBeerType(t) }),
    {}
  );

  const toggleServingType = (e, value) => {
    e.preventDefault();

    if (form.servingType === value) {
      setFormProperty("servingType", null);
    } else {
      setFormProperty("servingType", value);
    }
  };

  const servingTypeMap = servingTypes.reduce(
    (o, t) => ({ ...o, [t]: (e) => toggleServingType(e, t) }),
    {}
  );

  const resetErrors = () => {
    setFormErrors({
      imageUrl: null,
      name: null,
      brewer: null,
      rating: null,
      abv: null,
      ibu: null,
      date: null,
    });
  };

  const validateFields = () => {
    const errors = {
      imageUrl: formErrors.imageUrl,
      name: form.name === "" ? "Required" : null,
      brewer: form.brewer === "" ? "Required" : null,
      rating: !form.rating ? "Required" : null,
      abv: form.abv !== "" && !parseFloat(form.abv) ? "Invalid value" : null,
      ibu: form.ibu !== "" && !parseInt(form.ibu) ? "Invalid value" : null,
      date: form.date === "" ? "Required" : null,
    };

    setFormErrors(errors);

    let validity = true;
    for (const v of Object.values(errors)) {
      if (v !== null) {
        validity = false;
        break;
      }
    }

    return validity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    resetErrors();

    const valid = validateFields();
    if (!valid) return;

    setLoading(true);

    try {
      let res;
      if (editValues) {
        res = await editBeer(form.id, form);
      } else {
        res = await createBeer(form);
      }
      router.push(`/beer/${res.data.payload.id}`);
    } catch (e) {
      setError("Oops, an error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (editValues) {
      router.push(`/beer/${form.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form className={`${styles.beerForm}`} onSubmit={handleSubmit}>
      <ImageCropAndUpload
        onComplete={setImage}
        className={styles.imageCropAndUpload}
        errorMessage={formErrors.imageUrl}
        setError={(e) => setFormErrors({ ...formErrors, imageUrl: e })}
        initialImage={editValues ? form.imageUrl : undefined}
        placeholder="/beerIconSquare.svg"
      />
      <Input
        type="text"
        label="Beer Name"
        className={styles.beerName}
        htmlFor="name"
        value={form.name}
        handleChange={handleFieldChange}
        infoLabel={`${form.name.length} / 50`}
        errorMessage={formErrors.name}
        maxLength={50}
      />
      <Input
        type="text"
        label="Brewer"
        className={styles.brewer}
        htmlFor="brewer"
        value={form.brewer}
        handleChange={handleFieldChange}
        infoLabel={`${form.brewer.length} / 30`}
        errorMessage={formErrors.brewer}
        maxLength={30}
      />
      <Input
        type="date"
        label="Date"
        className={styles.date}
        htmlFor="date"
        value={form.date}
        onChange={handleFieldChange}
        errorMessage={formErrors.date}
      />
      <Input
        label="Rating"
        className={styles.beerRating}
        htmlFor="beerRating"
        errorMessage={formErrors.rating}
      >
        <Rating
          id="beerRating"
          precision={0.5}
          value={form.rating}
          size="large"
          onChange={handleRatingChange}
        />
      </Input>
      <Input
        label="Serving Type"
        className={styles.servingType}
        htmlFor="servingType"
        infoLabel="optional"
      >
        <CategoryGroup
          id="servingType"
          categoryMap={servingTypeMap}
          selected={form.servingType}
        />
      </Input>
      <Input label="Beer Type" className={styles.beerType} infoLabel="optional">
        <Dropdown
          label={form.beerType ? form.beerType : "select"}
          optionMap={beerTypeMap}
          visibility={beerTypeVisible}
          toggleVisibility={toggleBeerTypeVisibility}
          selected={form.beerType}
        />
      </Input>
      <Input
        type="text"
        label="% ABV"
        className={styles.abv}
        htmlFor="abv"
        value={form.abv}
        onChange={handleFieldChange}
        infoLabel="optional"
        errorMessage={formErrors.abv}
      />
      <Input
        type="text"
        label="IBU"
        className={styles.ibu}
        htmlFor="ibu"
        value={form.ibu}
        onChange={handleFieldChange}
        infoLabel="optional"
        errorMessage={formErrors.ibu}
      />
      <Input
        label="Notes"
        htmlFor="notes"
        className={styles.notes}
        infoLabel={`${255 - form.notes.length} characters remaining`}
      >
        <textarea
          id="notes"
          value={form.notes}
          onChange={handleFieldChange}
          maxLength={255}
        />
      </Input>
      <button
        type="submit"
        className={`btn btn-primary ${styles.save}`}
        disabled={loading}
      >
        Save
      </button>
      <button
        className={`btn btn-secondary ${styles.cancel}`}
        onClick={handleCancel}
        disabled={loading}
        type="button"
      >
        Cancel
      </button>
    </form>
  );
};

export default BeerForm;

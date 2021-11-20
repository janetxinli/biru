import React, { useState } from "react";
import { useRouter } from "next/router";
import { Rating } from "@mui/material";
import { getFormattedDate } from "../utils/getFormattedDate";
import { useForm } from "../hooks/form";
import { createBeer, editBeer } from "../services/beer";
import Dropdown from "./Dropdown";
import CategoryGroup from "./CategoryGroup";
import Input from "./Input";
import styles from "../styles/components/BeerForm.module.scss";

// TODO: add cancel button
const BeerForm = ({ setError, editMode, formValues }) => {
  const router = useRouter();

  // form field data states
  const { form, handleFieldChange, setFormProperty } = editMode
    ? useForm(formValues)
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
      });

  // form state
  const [beerTypeVisible, setBeerTypeVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: false,
    brewer: false,
    rating: false,
    abv: false,
    ibu: false,
  });

  const handleRatingChange = (e, value) => {
    setFormProperty("rating", value);
  };

  const beerTypeMap = {
    ale: () => toggleBeerType("ale"),
    lager: () => toggleBeerType("lager"),
    porter: () => toggleBeerType("porter"),
    stout: () => toggleBeerType("stout"),
    pilsner: () => toggleBeerType("pilsner"),
    "pale ale": () => toggleBeerType("pale ale"),
    wheat: () => toggleBeerType("wheat"),
    brown: () => toggleBeerType("brown"),
    blonde: () => toggleBeerType("blonde"),
    IPA: () => toggleBeerType("IPA"),
    sour: () => toggleBeerType("sour"),
    other: () => toggleBeerType("other"),
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

  const servingTypeMap = {
    can: (e) => toggleServingType(e, "can"),
    bottle: (e) => toggleServingType(e, "bottle"),
    draft: (e) => toggleServingType(e, "draft"),
  };

  const toggleServingType = (e, value) => {
    e.preventDefault();

    if (form.servingType === value) {
      setFormProperty("servingType", null);
    } else {
      setFormProperty("servingType", value);
    }
  };

  const resetErrors = () => {
    setFormErrors({
      name: false,
      brewer: false,
      rating: false,
      abv: false,
      ibu: false,
    });
  };

  const validateFields = () => {
    // check for required fields
    let valid = true;

    if (!form.name || !form.brewer || !form.rating) {
      valid = false;
    }

    // ABV must be a float
    if (form.abv !== "" && !parseFloat(form.abv)) {
      valid = false;
    }

    // IBU must be an int
    if (form.ibu !== "" && !parseInt(form.ibu)) {
      valid = false;
    }

    setFormErrors({
      name: form.name === "",
      brewer: form.brewer === "",
      rating: !form.rating,
      abv: form.abv !== "" && !parseFloat(form.abv),
      ibu: form.ibu !== "" && !parseInt(form.ibu),
    });

    return valid;
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
      if (editMode) {
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

  return (
    <>
      <form className={`${styles.beerForm}`}>
        <Input
          type="text"
          label="Beer Name"
          className={styles.beerName}
          htmlFor="name"
          value={form.name}
          handleChange={handleFieldChange}
          infoLabel={`${form.name.length} / 50`}
          error={formErrors.name}
          errorMessage="Name is required"
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
          error={formErrors.brewer}
          errorMessage="Brewer is required"
          maxLength={30}
        />
        <Input
          type="date"
          label="Date"
          className={styles.date}
          htmlFor="date"
          value={form.date}
          onChange={handleFieldChange}
        />
        <Input
          label="Rating"
          className={styles.beerRating}
          htmlFor="beerRating"
          error={formErrors.rating}
          errorMessage="Rating is required"
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
          infoLabel="(optional)"
        >
          <CategoryGroup
            id="servingType"
            categoryMap={servingTypeMap}
            selected={form.servingType}
          />
        </Input>
        <Input
          label="Beer Type"
          className={styles.beerType}
          infoLabel="(optional)"
        >
          <Dropdown
            label={form.beerType ? form.beerType : "select"}
            optionMap={beerTypeMap}
            visibility={beerTypeVisible}
            toggleVisibility={toggleBeerTypeVisibility}
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
          error={formErrors.abv}
          errorMessage="Invalid value"
        />
        <Input
          type="text"
          label="IBU"
          className={styles.ibu}
          htmlFor="ibu"
          value={form.ibu}
          onChange={handleFieldChange}
          infoLabel="(optional)"
          error={formErrors.ibu}
          errorMessage="Invalid value"
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
          ></textarea>
        </Input>
        <button
          type="submit"
          className={`btn btn-primary ${styles.save}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          Save
        </button>
      </form>
    </>
  );
};

export default BeerForm;

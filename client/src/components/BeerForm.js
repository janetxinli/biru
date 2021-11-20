import React, { useState } from "react";
import { useRouter } from "next/router";
import { Rating } from "@mui/material";
import { getFormattedDate } from "../utils/getFormattedDate";
import { useForm } from "../hooks/form";
import { createBeer, editBeer } from "../services/beer";
import Dropdown from "./Dropdown";
import CategoryGroup from "./CategoryGroup";
import styles from "../styles/components/BeerForm.module.scss";

// TODO: wrapper component for validated form inputs?
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

    if (servingType === value) {
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
        <label
          htmlFor="name"
          className={`${styles.beerName} ${
            formErrors.name ? styles.formError : ""
          }`}
        >
          <p className="df df-jc-sb df-ai-c">
            Beer Name
            <span className={styles.inputInfo}>{form.name.length}/50</span>
          </p>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleFieldChange}
            maxLength={50}
          />
          <p className={formErrors.name ? styles.formErrorLabel : "hidden"}>
            Name is required
          </p>
        </label>
        <label
          htmlFor="brewer"
          className={`${styles.brewer} ${
            formErrors.brewer ? styles.formError : ""
          }`}
        >
          <p className="df df-jc-sb df-ai-c">
            Brewer
            <span className={styles.inputInfo}>{form.brewer.length}/30</span>
          </p>
          <input
            id="brewer"
            type="text"
            value={form.brewer}
            onChange={handleFieldChange}
            maxLength={30}
          />
          <p className={formErrors.brewer ? styles.formErrorLabel : "hidden"}>
            Brewer is required
          </p>
        </label>
        <label htmlFor="date" className={styles.date}>
          <p>Date</p>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={handleFieldChange}
          />
        </label>
        <label
          htmlFor="beerRating"
          className={`${styles.beerRating} ${
            formErrors.rating ? styles.formError : ""
          }`}
        >
          <p>Rating</p>
          <Rating
            id="beerRating"
            precision={0.5}
            value={form.rating}
            size="large"
            onChange={handleRatingChange}
          />
          <p className={formErrors.rating ? styles.formErrorLabel : "hidden"}>
            Rating is required
          </p>
        </label>
        <label htmlFor="servingType" className={styles.servingType}>
          <p>
            Serving Type <span className={styles.inputInfo}>(optional)</span>
          </p>
          <CategoryGroup
            id="servingType"
            categoryMap={servingTypeMap}
            selected={form.servingType}
          />
        </label>
        <label className={styles.beerType}>
          <p>
            Beer Type <span className={styles.inputInfo}>(optional)</span>
          </p>
          <Dropdown
            label={form.beerType ? form.beerType : "select"}
            optionMap={beerTypeMap}
            visibility={beerTypeVisible}
            toggleVisibility={toggleBeerTypeVisibility}
          />
        </label>

        <label
          htmlFor="abv"
          className={`${styles.abv} ${formErrors.abv ? styles.formError : ""}`}
        >
          <p>
            % ABV <span className={styles.inputInfo}>(optional)</span>
          </p>
          <input id="abv" value={form.abv} onChange={handleFieldChange} />
          <p className={formErrors.abv ? styles.formErrorLabel : "hidden"}>
            Invalid value
          </p>
        </label>
        <label
          htmlFor="ibu"
          className={`${styles.ibu} ${formErrors.ibu ? styles.formError : ""}`}
        >
          <p>
            IBU <span className={styles.inputInfo}>(optional)</span>
          </p>
          <input id="ibu" value={form.ibu} onChange={handleFieldChange} />
          <p className={formErrors.ibu ? styles.formErrorLabel : "hidden"}>
            Invalid value
          </p>
        </label>
        <label htmlFor="notes" className={styles.notes}>
          <p>
            Notes <span className={styles.inputInfo}>(optional)</span>
          </p>
          <textarea
            id="notes"
            value={form.notes}
            onChange={handleFieldChange}
            maxLength={255}
          ></textarea>
          <p className={`${styles.inputInfo} ${styles.noteChars}`}>
            {255 - form.notes.length} characters remaining
          </p>
        </label>
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

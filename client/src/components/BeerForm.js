import React, { useState } from "react";
import { useRouter } from "next/router";
import { Rating } from "@mui/material";
import { getToday } from "../utils/getToday";
import { useField } from "../hooks/form";
import { createBeer } from "../services/beer";
import PageError from "./PageError";
import Dropdown from "./Dropdown";
import CategoryGroup from "./CategoryGroup";
import styles from "../styles/BeerForm.module.scss";

// TODO: create new hook for form

export default function BeerForm() {
  const router = useRouter();

  // form field data states
  const name = useField("text");
  const brewer = useField("text");
  const [rating, setRating] = useState(0);
  const [beerType, setBeerType] = useState(null);
  const [servingType, setServingType] = useState(null);
  const abv = useField("text");
  const ibu = useField("text");
  const notes = useField("text");
  const date = useField("date", getToday());

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
  const [pageError, setPageError] = useState(null);

  const handleRatingChange = (e, value) => {
    setRating(value);
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
  };

  const toggleBeerTypeVisibility = (e) => {
    e.preventDefault();
    setBeerTypeVisible(!beerTypeVisible);
  };

  const toggleBeerType = (value) => {
    if (beerType === value) {
      setBeerType(null);
    } else {
      setBeerType(value);
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
      setServingType(null);
    } else {
      setServingType(value);
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

    if (!name.value || !brewer.value || !rating) {
      valid = false;
    }

    // ABV must be a float
    if (abv.value !== "" && !parseFloat(abv.value)) {
      valid = false;
    }

    // IBU must be an int
    if (ibu.value !== "" && !parseInt(ibu.value)) {
      valid = false;
    }

    setFormErrors({
      name: name.value === "",
      brewer: brewer.value === "",
      rating: !rating,
      abv: abv.value !== "" && !parseFloat(abv.value),
      ibu: ibu.value !== "" && !parseInt(ibu.value),
    });

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageError(null);
    resetErrors();

    const valid = validateFields();
    if (!valid) return;

    const newBeer = {
      name: name.value,
      brewer: brewer.value,
      rating,
      serving_type: servingType,
      beer_type: beerType,
      abv: abv.value,
      ibu: ibu.value,
      date: date.value,
      notes: notes.value,
    };

    setLoading(true);
    try {
      const res = await createBeer(newBeer);
      router.push(`/beer/${res.data.payload.id}`);
    } catch (e) {
      setPageError("Oops, an error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className={styles.formTitle}>Add a New Beer</h2>
      {pageError && <PageError message={pageError} />}
      <form className={`${styles.beerForm}`}>
        <label
          htmlFor="beerName"
          className={`${styles.beerName} ${
            formErrors.name ? styles.formError : ""
          }`}
        >
          <p className="df df-jc-sb df-ai-c">
            Beer Name
            <span className={styles.inputInfo}>{name.value.length}/50</span>
          </p>
          <input id="beerName" {...name} maxLength={50} />
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
            <span className={styles.inputInfo}>{brewer.value.length}/30</span>
          </p>
          <input id="brewer" {...brewer} maxLength={30} />
          <p className={formErrors.brewer ? styles.formErrorLabel : "hidden"}>
            Brewer is required
          </p>
        </label>
        <label htmlFor="date" className={styles.date}>
          <p>Date</p>
          <input id="date" {...date} />
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
            value={rating}
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
            selected={servingType}
          />
        </label>
        <label className={styles.beerType}>
          <p>
            Beer Type <span className={styles.inputInfo}>(optional)</span>
          </p>
          <Dropdown
            label={beerType ? beerType : "select"}
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
          <input id="abv" {...abv} />
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
          <input id="ibu" {...ibu} />
          <p className={formErrors.ibu ? styles.formErrorLabel : "hidden"}>
            Invalid value
          </p>
        </label>
        <label htmlFor="notes" className={styles.notes}>
          <p>
            Notes <span className={styles.inputInfo}>(optional)</span>
          </p>
          <textarea id="notes" {...notes} maxLength={255}></textarea>
          <p className={`${styles.inputInfo} ${styles.noteChars}`}>
            {255 - notes.value.length} characters remaining
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
}

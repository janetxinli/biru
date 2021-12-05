import React, { useState } from "react";
import Cropper from "react-easy-crop";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import Slider from "@mui/material/Slider";
import ImageInput from "./ImageInput";
import { cropImage } from "../utils/cropImage";
import { uploadImage } from "../services/image";
import globalConfig from "../../../globalConfig.json";
import styles from "../styles/components/ImageCropAndUpload.module.scss";

const ImageCropAndUpload = ({
  onComplete,
  className,
  error,
  setError,
  initialImage,
}) => {
  const [image, setImage] = useState({ url: null, fileType: null });
  const [preview, setPreview] = useState(initialImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // check file size
      if (fileSize > globalConfig.MAX_IMAGE_SIZE) {
        setError("Maximum file size is 10MB");
      } else {
        const url = URL.createObjectURL(e.target.files[0]);
        const fileType = e.target.files[0].type;
        setImage({ url, fileType });
      }
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleZoomChange = (e, value) => {
    setZoom(value);
  };

  const handleRotate = (e) => {
    e.preventDefault();
    const newAngle = (rotation + 90) % 360;
    setRotation(newAngle);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setPreview(null);

    const img = await cropImage(
      image.url,
      image.fileType,
      croppedAreaPixels,
      rotation
    );
    try {
      const res = await uploadImage(img.url);
      onComplete(res.data.payload.url);
      setPreview(img);
    } catch (e) {
      setError("Failed to upload image");
    } finally {
      setImage({ url: null, fileType: null });
      setLoading(false);
      setRotation(0);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setImage({ url: null, fileType: null });
  };

  return (
    <article className={className ? className : null}>
      <ImageInput
        handleChange={handleImageChange}
        label="Upload an Image"
        htmlFor="beerImage"
        preview={preview}
        className={error ? styles.errorBorder : null}
      />
      {image.url !== null && (
        <div className={styles.cropContainer}>
          <section className={styles.cropImage}>
            <Cropper
              image={image.url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              rotation={rotation}
            />
          </section>
          <section className={`df df-ai-c df-jc-c ${styles.cropControls}`}>
            <button
              className={`btn btn-icon ${styles.rotateBtn}`}
              onClick={handleRotate}
            >
              <CropRotateIcon />
            </button>
            <Slider
              key="slider"
              aria-label="Zoom"
              defaultValue={1}
              value={zoom}
              step={0.1}
              min={1}
              max={3}
              onChange={handleZoomChange}
            />
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </section>
        </div>
      )}
      {error !== null && <p className={styles.errorText}>{error}</p>}
    </article>
  );
};

export default ImageCropAndUpload;

import React from "react";
import { Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonUpload: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    image: {
      maxWidth: "100%",
      marginBottom: theme.spacing(1),
    },
  })
);

type UploadImageButtonProps = {
  imagePreviewUrl: string;
  onChange: (url: string, data: FormData) => void;
  buttonText: string;
};

export default function UploadImageButton({
  imagePreviewUrl,
  onChange,
  buttonText,
}: UploadImageButtonProps) {
  const classes = useStyles();

  const handleImageChange = async (e: any) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length > 0) {
      const image = files[0];
      const formData = new FormData();
      formData.append("file", image);

      // Para la previsualización de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string, formData);
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="contained"
          id="raised-button-file"
          color="secondary"
          startIcon={<ImageIcon />}
          component="span"
          className={classes.buttonUpload}
        >
          {buttonText}
        </Button>
      </label>
      <br />
      {imagePreviewUrl && (
        <img
          className={classes.image}
          src={imagePreviewUrl as any}
          alt="Imagen del elemento"
        />
      )}
    </>
  );
}

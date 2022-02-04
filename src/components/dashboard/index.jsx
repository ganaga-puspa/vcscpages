import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CKEditor from "react-ckeditor-component";
import axios from "axios";
import Box from "@mui/material/Box";
import { DropzoneArea } from "material-ui-dropzone";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [FaceBook, setFaceBook] = useState("");
  const [YouTube, setYouTube] = useState("");
  const [ContactInfo, setContactInfo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [filedata, setFile] = useState([]);
  const SubmitValue = async () => {
    const data = new FormData();

    for (let i = 0; i < filedata.length; i++) {
      data.append("file[]", filedata[i]);
    }

    let url = "http://127.0.0.1:8888/api/upload.php";
    axios
      .post(url, data, {})
      .then((res) => {
        console.log(res.data);
        setTimeout(displayHello, 1000, res.data);
      })

      .catch(
        Swal.fire({
          title: "Error!",
          text: "something wrong",
          icon: "error",
          confirmButtonText: "ok",
        })
      );
  };
  const displayHello = (res) => {
    console.log("dataurl", res);
    axios
      .post("http://127.0.0.1:8888/api/api.php", {
        name: name,
        about: content,
        facebook: FaceBook,
        youtube: YouTube,
        mobile: ContactInfo,
        email: email,
        address: address,
        imgs: res,
      })
      .then(
        Swal.fire({
          title: "Saved!",
          text: "Data was Saved successfully!",
          icon: "success",
          confirmButtonText: "ok",
        })
      )
      .catch(
        Swal.fire({
          title: "Error!",
          text: "something wrong",
          icon: "error",
          confirmButtonText: "ok",
        })
      );
  };
  const onChange = (evt) => {
    var newContent = evt.editor.getData();
    setContent(newContent);
  };
  const onChangeImg = (event) => {
    setFile(event.target.files[0]);
    setFile({
      selectedFile: event.target.files,
      responseArray: [],
    });
  };
  const handleChange = (files) => {
    setFile(files);
  };
  return (
    <div class="dasboard-container">
      <Container fixed>
        <Card sx={{ height: "80vh", margin: "20px" }}>
          <CardContent>
            <p>About</p>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <CKEditor
                  activeClass="p10"
                  content={content}
                  events={{
                    change: onChange,
                  }}
                />
                <DropzoneArea onChange={handleChange} filesLimit={50} />
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    "& .MuiTextField-root": {
                      maxWidth: "100%",
                      padding: "10px",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    id="FaceBook"
                    label="FaceBook"
                    variant="outlined"
                    onChange={(e) => setFaceBook(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="YouTube"
                    label="YouTube"
                    variant="outlined"
                    onChange={(e) => setYouTube(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="Contact Info"
                    label="Contact Info"
                    variant="outlined"
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="name"
                    label="name"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="address"
                    label="address"
                    variant="outlined"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="email"
                    label="email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>
            <div
              className="row"
              style={{ justifyContent: "center", marginTop: "15px" }}
            >
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={SubmitValue}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;

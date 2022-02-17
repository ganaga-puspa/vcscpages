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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReactJson from "react-json-view";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [FaceBook, setFaceBook] = useState("");
  const [YouTube, setYouTube] = useState("");
  const [ContactInfo, setContactInfo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [filedata, setFile] = useState([]);
  const [tabvalue, setTabValue] = useState(0);
  const [families, setfamilies] = React.useState([]);

  const SubmitValue = async () => {
    const data = new FormData();
    if (filedata.length == "") {
      Swal.fire({
        title: "Error!",
        text: "Please upload image files",
        icon: "error",
        confirmButtonText: "ok",
      });
    } else {
      if (
        content !== "" &&
        FaceBook !== "" &&
        YouTube !== "" &&
        ContactInfo !== "" &&
        email !== "" &&
        address !== "" &&
        name !== ""
      ) {
        for (let i = 0; i < filedata.length; i++) {
          data.append("file[]", filedata[i]);
        }
        let url = "https://dev.dnshko.in/api/upload.php";
        axios.post(url, data, {}).then((res) => {
          console.log(res.data);
          SavaMyData(res.data);
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Content is misssing!",
          icon: "error",
          confirmButtonText: "ok",
        });
      }
    }
  };
  const SavaMyData = (res) => {
    console.log("dataurl", res);
    axios
      .post("https://dev.dnshko.in/api/api.php", {
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    axios.get("https://dev.dnshko.in/api/users.json").then((res) => {
      console.log(res.data);
      setfamilies(res.data);
    });
  }, []);

  return (
    <div class="dasboard-container">
      <Container>
        <Card sx={{ height: "auto", margin: "20px" }}>
          <CardContent>
            <Tabs
              value={tabvalue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="EDITOR" />
              <Tab label="JSON" />
            </Tabs>
            <TabPanel value={tabvalue} index={0}>
              <Grid container spacing={2}>
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
                      label="Name"
                      variant="outlined"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      multiline
                      rows={4}
                      id="address"
                      label="Address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      variant="outlined"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <p>About</p>
                  <CKEditor
                    activeClass="p10"
                    content={content}
                    events={{
                      change: onChange,
                    }}
                  />
                  <DropzoneArea
                    onChange={handleChange}
                    filesLimit={50}
                    acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                  />
                </Grid>
              </Grid>

              <div
                className="row"
                style={{ justifyContent: "center", marginTop: "15px" }}
              >
                <button className="btn btn-primary" onClick={SubmitValue}>
                  Save
                </button>
              </div>
            </TabPanel>
            <TabPanel value={tabvalue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReactJson src={families} theme="tomorrow" />
                </Grid>
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;

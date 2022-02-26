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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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

import { storage, db } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  listAll,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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
  const [filedata, setFile] = useState();
  const [tabvalue, setTabValue] = useState(0);
  const [families, setfamilies] = React.useState([]);
  const [family, setFamily] = React.useState([{}]);
  const [famData, setFamData] = useState("");
  const [userID, setUserID] = useState("");
  const [progress, setProgress] = useState(0);
  const [check, setCheck] = useState("");
  const [data, setData] = useState("");
  // const [active, setActive] = useState(false);

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
  const SavaMyData = () => {
    // console.log("dataurl", res);
    db.collection("Family")
      .add({
        name: name,
        about: content,
        facebook: FaceBook,
        youtube: YouTube,
        mobile: ContactInfo,
        email: email,
        address: address,
        // imgs: res,
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

  const uploadFiles = () => {
    // const data = new FormData();
    // for (let i = 0; i < filedata.length; i++) {
    //   data.append("file[]", filedata[i]);
    // }
    const metadata = {
      contentType: "image/jpg",
    };
    // if (!data) return;
    const storageRef = ref(storage, "images/" + `${filedata.name}`);
    const uploadTask = uploadBytesResumable(storageRef, filedata, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // setdownloadURL(downloadURL);

          Swal.fire({
            icon: "success",
            title: "UPLOADED SUCCESS",
            confirmButtonText: "Save",
            // footer: `<a href=${downloadURL} target="_blank">View the File</a>`,
          }).then((result) => {
            console.log("result", result);
          });
        });
      }
    );
  };

  const onChangeSelect = (evt) => {
    setFamData(evt.target.value);
    if (evt.target.value === "AddNewFamily") {
      setName("");
      setEmail("");
      setContent("");
      setFaceBook("");
      setYouTube("");
      setAddress("");
      setContactInfo("");
    } else {
      const select = family.find((test) => test.id === evt.target.value);
      setName(select.name);
      setEmail(select.email);
      setContent(select.about);
      setFaceBook(select.facebook);
      setYouTube(select.youtube);
      setAddress(select.address);
      setContactInfo(select.mobile);
      // setActive(true);
      console.log("select", select);
    }
  };
  const deleteFamily = () => {
    if (famData === "AddNewFamily") {
      Swal.fire({
        icon: "error",
        title: " Please select the family to delete",
        confirmButtonText: "OK",
      });
    } else {
      const Familyid = famData;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDoc(doc(db, "Family", Familyid));
          // const select = family.find((test) => test.id === famData);
          console.log("Delete");
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
        setName("");
        setEmail("");
        setContent("");
        setFaceBook("");
        setYouTube("");
        setAddress("");
        setContactInfo("");
      });
    }
  };

  const editFamily = async () => {
    if (famData === "AddNewFamily") {
      Swal.fire({
        icon: "error",
        title: " Please select the family to update",
        confirmButtonText: "OK",
      });
    } else {
      const Familyid = famData;
      await updateDoc(doc(db, "Family", Familyid), {
        name: name,
        about: content,
        facebook: FaceBook,
        youtube: YouTube,
        mobile: ContactInfo,
        email: email,
        address: address,
        // FaceBook,
        // YouTube,
        // address,
        // ContactInfo,
      }).then(
        Swal.fire({
          icon: "success",
          title: "UPDATE SUCCESS",
          confirmButtonText: "Done",
        })
        //  .then((result) => {
        //    setShow(false);
        //    setNewstitle(""), setContent(""), setfiles("");
        //    setfileName("");
        //    seteditid(false);
        //  })
      );
    }
  };

  const onChange = (evt) => {
    var newContent = evt.editor.getData();
    setContent(newContent);
  };
  const onChangeImg = (event) => {
    setFile(event.target.files);
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
    const famRef = collection(db, "Family");

    onSnapshot(famRef, (snapshot) => {
      let famdata = [];
      snapshot.docs.forEach((doc) => {
        famdata.push({ ...doc.data(), id: doc.id });
      });
      console.log("userdata", famdata);
      setfamilies(famdata);
      setFamily(famdata);
      // setCheck(q);

      // console.log("famdata", famdata);
    });
  }, []);

  const FamName = family.map((test) => test.name);
  const FamNameId = family.map((test) => test.id);

  const DataFilter = (id) => {
    famData === FamName[0] ? console.log("Haha") : console.log("OOOO");
    // const famRef = collection(db, "Family");

    // const q = query(famRef, where("name", "===", `${famData}`));
    // console.log("check", q);
  };

  console.log("FamNameId", FamNameId);
  console.log("FamName", FamName);

  console.log("famData", famData);

  // const EditUSers = (famData) => {
  //   const userid = famData.map((d) => {
  //     return d.id;
  //   });
  //   setUserID(userid[0]);
  // };

  // console.log("userID", userID);

  // React.useEffect(() => {
  //   axios.get("https://dev.dnshko.in/api/users.json").then((res) => {
  //     console.log(res.data);
  //     setfamilies(res.data);
  //   });
  // }, []);

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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Please select to add new family or select family
                </InputLabel>
                <Select
                  // labelId="demo-simple-select-label"
                  // id="demo-simple-select"
                  value={famData}
                  label="Please select to add new family or select family"
                  onChange={onChangeSelect}
                >
                  <MenuItem value="AddNewFamily" autoFocus="true">
                    Add new family
                  </MenuItem>
                  {family.map((Data) => (
                    <MenuItem
                      // key={students.email}
                      value={Data.id}
                    >
                      {Data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br /> <br />
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
                      // defaultValue={name}
                      value={name}
                      fullWidth
                      id="name"
                      label="Name"
                      variant="outlined"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      value={email}
                      fullWidth
                      id="email"
                      label="Email"
                      variant="outlined"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      value={ContactInfo}
                      fullWidth
                      id="Contact Info"
                      label="Contact Info"
                      variant="outlined"
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                    <TextField
                      value={FaceBook}
                      fullWidth
                      id="FaceBook"
                      label="FaceBook"
                      variant="outlined"
                      onChange={(e) => setFaceBook(e.target.value)}
                    />
                    <TextField
                      value={YouTube}
                      fullWidth
                      id="YouTube"
                      label="YouTube"
                      variant="outlined"
                      onChange={(e) => setYouTube(e.target.value)}
                    />

                    <TextField
                      value={address}
                      multiline
                      rows={4}
                      id="address"
                      label="Address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <p>About</p>
                  <CKEditor
                    value={content}
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
              {/* {famData === "Add new family" ? (
      
              ) : (
                // famdata.map((f) => (

                // ))
               
              )} */}
              <div
                className="row"
                style={{ justifyContent: "center", marginTop: "15px" }}
              >
                {/* {family.map((f) => {
                  return (
                    <div>
                     
                    </div>
                  );
                })} */}
                {/* {family.map((f) => (
                  
                ))} */}
                <button
                  className="btn btn-primary"
                  onClick={deleteFamily}
                  // disabled={active}
                >
                  Delete
                </button>
                &nbsp;
                <button className="btn btn-primary" onClick={editFamily}>
                  Update
                </button>
                &nbsp;
                {famData === "AddNewFamily" ? (
                  <button className="btn btn-primary" onClick={SavaMyData}>
                    Save
                  </button>
                ) : null}
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

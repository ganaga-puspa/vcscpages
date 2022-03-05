import React, { useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CKEditor from "react-ckeditor-component";
import axios from "axios";
import Box from "@mui/material/Box";
import { DropzoneArea } from "material-ui-dropzone";
import Swal from "sweetalert2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReactJson from "react-json-view";
import { CircularProgress, IconButton } from "@mui/material";
import { storage, db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import { Delete } from "@mui/icons-material";
import Presists from "./Presists";
export function TabPanel(props) {
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
  const [famData, setFamData] = useState("AddNewFamily");
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [priestData, setPriestData] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoader, setupdateLoader] = useState(false);

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
  const SavaMyData = async () => {
    
    if (
      content === "" ||
      FaceBook === "" ||
      YouTube === "" ||
      ContactInfo === "" ||
      email === "" ||
      address === "" ||
      name === ""
    ){
      return Swal.fire('Oops!','Please Fillout All fields','error')
    }
    setLoading(true)
    const docRef = await addDoc(collection(db,'Family'),{
                    name: name,
                    about: content,
                    facebook: FaceBook,
                    youtube: YouTube,
                    mobile: ContactInfo,
                    email: email,
                    address: address,
                    img: [],
                  })
    handleUpload(docRef.id,[])
    
  };

  const clearState = () =>{
    setName("");
    setEmail("");
    setContent("");
    setFaceBook("");
    setYouTube("");
    setAddress("");
    setContactInfo("");
    setUrls([])
    setFamData('AddNewFamily')
  }

  const onChangeSelect = (evt) => {
    setFamData(evt.target.value);
    if (evt.target.value === "AddNewFamily") {
      clearState()
    } else {
      const select = family.find((test) => test.id === evt.target.value);
      setName(select.name);
      setEmail(select.email);
      setContent(select.about);
      setFaceBook(select.facebook);
      setYouTube(select.youtube);
      setAddress(select.address);
      setContactInfo(select.mobile);
      setUrls(select.img)
      setImages([])
      // setActive(true);
      // console.log("select", select);
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
        allowEscapeKey:false,
        allowOutsideClick:false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDoc(doc(db, "Family", Familyid));
          // const select = family.find((test) => test.id === famData);
          console.log("Delete");
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
        clearState()
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
      setupdateLoader(true)
      const found = family.find(fam => fam.id === famData)
      const {img} = found
      const Familyid = famData;
      await updateDoc(doc(db, "Family", Familyid), {
        name: name,
        about: content,
        facebook: FaceBook,
        youtube: YouTube,
        mobile: ContactInfo,
        email: email,
        address: address,
        img: [...img],
      }).then(()=>{
          handleUpload(Familyid,img)
      }
      );
    }
  };

  const onChange = (evt) => {
    var newContent = evt.editor.getData();
    setContent(newContent);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    const famRef = collection(db, "Family");
    const priesRef = collection(db, "Presists");

    onSnapshot(famRef, (snapshot) => {
      let famdata = [];
      snapshot.docs.forEach((doc) => {
        famdata.push({ ...doc.data(), id: doc.id });
      });
     
      setfamilies(famdata);
      setFamily(famdata);
      
    });
    onSnapshot(priesRef, (snapshot) => {
      let famdata = [];
      snapshot.docs.forEach((doc) => {
        famdata.push({ ...doc.data(), id: doc.id });
      });
      setPriestData(famdata)
    });
  }, []);

  const handleChangeImage = (files) => {
    // for (let i = 0; i < files.length; i++) {
    //   const newImage = files[i];
    //   newImage["id"] = Math.random();
    //   setImages((prevState) => [...prevState, newImage]);
    //   console.log("i", i);
    //   setImageId(i);
    // }
    setImages(files)
  };

  const handleUpload = async (id,oldimgs) => {
  
    if(images.length===0){
      setLoading(false)
      setupdateLoader(false)
      clearState()
      return Swal.fire({
        title: "Saved!",
        text: "Data was Saved successfully!",
        icon: "success",
        confirmButtonText: "ok",
      }).then(()=>window.location.reload())
    }
    
    const uploadPromises = []

    images.map((image, index) => {
      const storageRef = ref(storage, "families/" + `${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      
      //   const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadPromises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => console.log(error),
      );
    });
    Promise.all(uploadPromises)
    .then(res =>{
      const promises = [];
      images.map(image =>{
        const downloader = getDownloadURL(ref(storage, `families/${image.name}`))
        promises.push(downloader)
      })
      Promise.all(promises)
      .then(async(res) => {
        await updateDoc(doc(db, "Family", id),{
          img:[...oldimgs,...res],
        })
        Swal.fire({
          title: "Saved!",
          text: "Data was Saved successfully!",
          icon: "success",
          confirmButtonText: "ok",
        })
        .then(()=>{
          setLoading(false)
          setupdateLoader(false)
          clearState()
          window.location.reload()
        })
        setLoading(false)
        setupdateLoader(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setupdateLoader(false)
      });
    })
   
  };

  const delImage = async (url) => {
    const removed = urls.filter(img => img !== url)
    setUrls(removed)
    await updateDoc(doc(db, "Family", famData),{
      img:removed
    })
  }
  // // console.log("images: ", images);
  // // console.log("urls", urls);

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
              <Tab label="Families" />
              <Tab label="Priests" />
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
                      key={Data.id}
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
                      <Grid container spacing={2}>
                    {
                      urls.length > 0 && 
                      urls.map((url,i) =>
                      <Grid item xs={6}>
                        <img key={i} src={url} width={"100"} height={"100"}/>
                        <IconButton aria-label="delete" color="error" onClick={()=>delImage(url)}>
                          <Delete/>
                        </IconButton>
                      </Grid>
                      )}
                      </Grid>
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
                  <br />
                  {/* <input type="file" multiple onChange={handleChangeImage} /> */}

                  <DropzoneArea
                    onChange={handleChangeImage}
                    showPreviewsInDropzone={images.length>0?true:false}
                    // filesLimit={50}
                    // acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                  />
                  <p style={{marginTop:'10px',color:'red'}}>Note: <span>Use Images with 868px X 406px resolution</span></p>
                  <br></br>
                  {progress !== 0 && <>
                  <h5 style={{ color: "#f73164", fontStyle: "italic" }}>
                    Uploading {progress}%
                  </h5>
                  <LinearProgress variant="determinate" value={progress} />
                  <br></br>
                  </>}
                  
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
                {/* <button onClick={handleUpload}>Upload</button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  // disabled={active}
                >
                  Image
                </button> */}
                {famData === "AddNewFamily" ? (
                  <button className="btn btn-primary" disabled={loading} onClick={SavaMyData}>
                    {loading?<CircularProgress size={24} color='error'/>:"Save"}
                  </button>
                ) :
                
                <>
                <button className="btn btn-primary" disabled={updateLoader} onClick={editFamily}>
                {updateLoader?<CircularProgress size={24} color='error'/>:"Update"}
                </button>
                &nbsp;
                <button
                  className="btn btn-danger"
                  onClick={deleteFamily}
                  // disabled={active}
                >
                  Delete
                </button>
                </>
                }
                &nbsp;
                
              </div>
            </TabPanel>
            <TabPanel value={tabvalue} index={1}>
              <Presists tabValue={tabvalue}/>
            </TabPanel>
            <TabPanel value={tabvalue} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReactJson src={{families,priests:priestData}} theme="tomorrow" />
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
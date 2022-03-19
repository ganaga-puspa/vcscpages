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
const Presists = () => {
    const [content, setContent] = useState("");
    const [FaceBook, setFaceBook] = useState("");
    const [YouTube, setYouTube] = useState("");
    const [ContactInfo, setContactInfo] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [filedata, setFile] = useState();
    const [tabvalue, setTabValue] = useState(0);
    const [families, setfamilies] = React.useState([]);
    const [family, setFamily] = React.useState([{}]);
    const [famData, setFamData] = useState("AddNewPresist");
    const [progress, setProgress] = useState(0);
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateLoader, setupdateLoader] = useState(false);

    const SavaMyData = async () => {
        setLoading(true)
        const docRef = await addDoc(collection(db,'Presists'),{
                        name: name,
                        about: content,
                        facebook: FaceBook,
                        youtube: YouTube,
                        mobile: ContactInfo,
                        email: email,
                        address: address,
                        img: [],
                        order
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
        setOrder('')
        setUrls([])
        setFamData('AddNewPresist')
      }
    
      const onChangeSelect = (evt) => {
        setFamData(evt.target.value);
        if (evt.target.value === "AddNewPresist") {
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
          setOrder(select.order)
          setImages([])
          // setActive(true);
          // console.log("select", select);
        }
      };
      const deleteFamily = () => {
        if (famData === "AddNewPresist") {
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
              deleteDoc(doc(db, "Presists", Familyid));
              // const select = family.find((test) => test.id === famData);
              console.log("Delete");
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            clearState()
          });
        }
      };
    
      const editFamily = async () => {
        if (famData === "AddNewPresist") {
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
          await updateDoc(doc(db, "Presists", Familyid), {
            name: name,
            about: content,
            facebook: FaceBook,
            youtube: YouTube,
            mobile: ContactInfo,
            email: email,
            address: address,
            img: [...img],
            order
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
        const famRef = collection(db, "Presists");
    
        onSnapshot(famRef, (snapshot) => {
          let famdata = [];
          snapshot.docs.forEach((doc) => {
            famdata.push({ ...doc.data(), id: doc.id });
          });
          // console.log("userdata", famdata);
          setfamilies(famdata);
          setFamily(famdata);
          // setCheck(q);
    
          // console.log("famdata", famdata);
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
          const storageRef = ref(storage, "presists/" + `${image.name}`);
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
            const downloader = getDownloadURL(ref(storage, `presists/${image.name}`))
            promises.push(downloader)
          })
          Promise.all(promises)
          .then(async(res) => {
            await updateDoc(doc(db, "Presists", id),{
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
        await updateDoc(doc(db, "Presists", famData),{
          img:removed
        })
      }
  return (
            <>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Please select to add new Presists or select Presist
                </InputLabel>
                <Select
                  // labelId="demo-simple-select-label"
                  // id="demo-simple-select"
                  value={famData}
                  label=" Please select to add new Presists or select Presist"
                  onChange={onChangeSelect}
                >
                  <MenuItem value="AddNewPresist" autoFocus="true">
                    Add new Presist
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
              <br/>
              <br/>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Order of a Priest
                </InputLabel>
                <Select
                onChange={(e)=>setOrder(e.target.value)}
                value={order}
                label="Please select the order family">
                  {family.map((data,i) =>(
                    <MenuItem key={i} value={i+1}>
                      {i+1}
                    </MenuItem>
                  ))}
                  <MenuItem>
                      {family.length+1}
                    </MenuItem>
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
                {famData === "AddNewPresist" ? (
                  <button className="btn btn-primary" disabled={loading} onClick={SavaMyData}>
                    {loading?<CircularProgress size={24} color='error'/>:"Save"}
                  </button>
                ) : 
                <>
                &nbsp;
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
                &nbsp;
                </>}
                
              </div>
            </>
  )
}

export default Presists
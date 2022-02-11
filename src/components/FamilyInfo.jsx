import React from "react";
import { Container, Paper, Box, Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
function FamilyInfo({ family }) {
  function createMarkup(family) {
    return { __html: family };
  }
  return (
    <div>
      <Container class="coontainer">
        <h2 class="heading">About {family && family.name}</h2>
        <Container class="boox coolor">
          <Box sx={{ p: 2 }}>
            <Paper elevation={6} sx={{ p: 2 }}>
              <div
                class="aboutpara"
                dangerouslySetInnerHTML={createMarkup(family && family.about)}
              />
            </Paper>
          </Box>
        </Container>
        <h3 class="texts">
          <i class="fa-brands fa-facebook-square"></i>Facebook:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`${family && family.facebook}`}
          >
            {family && family.facebook}
          </a>
        </h3>
        <h3 class="texts">
          <i class="fa-brands fa-youtube-square"></i>Youtube :{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`${family && family.youtube}`}
          >
            {family && family.youtube}
          </a>
        </h3>
        <h2 class="texts">Contact Info</h2>
        <Container class="boox2">
          <Paper elevation={2} sx={{ p: 2 }}>
            <h3 class="mob">
              Mobile :{" "}
              <a href={`tel://${family && family.mobile}`}>
                <Button startIcon={<CallIcon />} variant="outlined">
                  Give a Call
                </Button>
              </a>
            </h3>
            <h3 class="emal">
              Email :{" "}
              <a href={`mailto:${family && family.email}`}>
                <Button startIcon={<MailIcon />} variant="outlined">
                  Drop a Mail
                </Button>
              </a>
            </h3>
            <h3 class="reaach">Reach out us :</h3>
            <Container>
              <h5 class="reaachpara">{family && family.address}</h5>
            </Container>
          </Paper>
          {/* </Box> */}
        </Container>
      </Container>
    </div>
  );
}

export default FamilyInfo;

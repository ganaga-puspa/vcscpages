import React from 'react'
import { Container,Paper,Box, Button } from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import MailIcon from '@mui/icons-material/Mail'
function FamilyInfo({family}) {
    return (
        <div>
            <Container>
                <h2>About {family && family.name}</h2>
                <Container>
                    <Box sx={{p:2}}>
                <Paper elevation={6} sx={{p:2}}>
                    <h5>{family && family.about}</h5>
                </Paper>
                    </Box>
                </Container>
                <h3>Facebook:  <a target="_blank" rel="noreferrer" href={`${family && family.facebook}`}>{family && family.facebook}</a></h3>
                <h3>Youtube: <a target="_blank" rel="noreferrer" href={`${family && family.youtube}`}>{family && family.youtube}</a></h3>
                <h2>Contact Info</h2>
                <Container>
                    
                        <Paper elevation={2} sx={{p:2}}>
                            <h3>Mobile :  <a href={`tel://${family && family.mobile}`}><Button startIcon={<CallIcon/>} variant='outlined'>Give a Call</Button></a></h3>
                            <h3>Email :  <a href={`mailto:${family && family.email}`}><Button startIcon={<MailIcon/>} variant='outlined'>Drop a Mail</Button></a></h3>
                            <h3>Reach out us   :</h3>
                            <Container>
                                <h5>{family && family.address}</h5>
                            </Container>
                        </Paper>
                    {/* </Box> */}
                </Container>
            </Container>
        </div>
    )
}

export default FamilyInfo

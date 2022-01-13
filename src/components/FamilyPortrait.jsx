import React from 'react'
import Carousel from 'react-material-ui-carousel'

const Renderimages = ({img}) => {
    return (
        <figure>
            <img src={img} style={{width:'100%',height:'500px'}} alt=''/>
        </figure>
    )
}

function FamilyPortrait({family}) {

    
    return (
        <div>
            <Carousel indicators={false}>
                {family && family.imgs.map(img => <Renderimages img={img}/>)}
            </Carousel>
        </div>
    )
}

export default FamilyPortrait

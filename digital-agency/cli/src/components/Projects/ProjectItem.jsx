import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import {useNavigate} from "react-router-dom";
import {PROJECT_ROUTE} from "../../utils/consts";
import UserService from "../../services/UserService";
import {deleteOneProject} from "../../services/ProjectService";
import * as ProjectService from "../../services/ProjectService";
import {useMutation, useQueryClient} from "react-query";

const ProjectItem = ({project}) => {
    const queryClient = useQueryClient()
    const deleteProj = (projectId) => {
        try {
            // await ProjectService.deleteOneProject(id);
            mutation.mutate(projectId)
        } catch (e) {
            alert(e)
            console.log(e);
        }
    }
    const mutation = useMutation(projectId => deleteOneProject(projectId),
        {onSuccess: () => queryClient.invalidateQueries(["projects"])}
    )
    const navigate = useNavigate()
    return (
        <Card className="mb-5" sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => navigate(PROJECT_ROUTE + '/' + project.id)}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {project.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button onClick={() => deleteProj(project.id)} size="small" color="primary">
                    Delete
                </Button>
            </CardActions>
        </Card>
        // <Col md={3} className="mt-3" >
        //     <Card style={{ width: 'auto', cursor:'pointer' }}>
        //         <Card.Img variant="top" src={process.env.REACT_APP_API_URL + device.img} />
        //         <Card.Body>
        //             <Card.Title>{device.name}</Card.Title>
        //             <Card.Text>
        //                 <div className="text-black-50">
        //                     Brand
        //                 </div>
        //                 <div>
        //                     Рейтинг: {device.rating}
        //                 </div>
        //                 <div>
        //                     {device.price} Rub
        //                 </div>
        //             </Card.Text>
        //             <Button variant="primary">Go somewhere</Button>
        //         </Card.Body>
        //     </Card>
        // </Col>
    );
};

export default ProjectItem;
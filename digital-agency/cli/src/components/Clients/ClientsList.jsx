import React from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {fetchClients} from "../../services/ClientService";
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';

const ClientsList = observer(() => {
    const {data, isLoading, isError} = useQuery('clients', fetchClients)

    // console.log(data)
    // const {device} = useContext(ContextProvider)

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>Error</div>
    }


    return (
        <Row className="lg:flex md:flex-wrap">
            {/*{data && data.map(client =>*/}
            {/*    <ProjectItem key={client.id} client={client} />*/}
            {/*)}*/}

            <List sx={{ width: '100%', maxWidth: 960, bgcolor: 'background.paper' }}>
                {data && data.map((client) => (
                    <ListItem key={client.id}
                              secondaryAction={
                                  <IconButton aria-label="comment">
                                      <CommentIcon />
                                  </IconButton>
                              }
                    >
                        <ListItemText primary={client.user.name} primary={client.user.surname} secondary={`User ID: ${client.userId}`} />
                        {/*<ListItemSecondaryAction>*/}
                        {/*    <IconButton edge="end" onClick={() => onEdit(client)}>*/}
                        {/*        <Edit />*/}
                        {/*    </IconButton>*/}
                        {/*    <IconButton edge="end" onClick={() => onDelete(client.id)}>*/}
                        {/*        <Delete />*/}
                        {/*    </IconButton>*/}
                        {/*</ListItemSecondaryAction>*/}
                    </ListItem>
                ))}
            </List>
        </Row>
    );
});

export default ClientsList;
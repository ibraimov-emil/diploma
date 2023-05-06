import React, {useContext} from 'react';
import {Card, Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {ContextProvider} from "../contexts/ContextProvider";

const BrandBar = observer(() => {
    const {device} = useContext(ContextProvider)
    return (
        <Row>
            {device.brands.map(brand =>
                <Card
                    style={{cursor: 'pointer'}}
                    key={brand.id}
                    className="p-1 col-md-2 align-items-center ms-1"
                    onClick={() => device.setSelectedBrand(brand)}
                    border={brand.id == device.selectedBrand.id ? 'danger' : 'light'}
                >
                    {brand.name}
                </Card>
            )}
        </Row>
    );
});

export default BrandBar;
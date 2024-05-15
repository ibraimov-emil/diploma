import React, {useState} from 'react'
import {Modal} from "antd";

const CustomModal = ({children, content, title}) => {
    const [open, setOpen] = useState();

    return (
        <>

            <div className={`contents`} onClick={() => setOpen(true)}>
                {children}
            </div>
            <Modal
                className={'max-h-[80%] mb-5'}
                title={title}
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
            >
                {content}
            </Modal>
        </>
    )
}
export default CustomModal

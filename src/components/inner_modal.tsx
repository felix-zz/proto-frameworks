import * as React from 'react';
import {Component, CSSProperties, ReactNode} from 'react';
import ReactDOM from 'react-dom';
import {Util} from '../util/util';
import {CloseOutlined} from '@ant-design/icons';
import $ from 'jquery';

interface InnerModalProps {
    display: boolean;
    onClose: () => void;
    style?: CSSProperties;
    title?: ReactNode;
}

interface InnerModalState {
}

let containerMounted = false;

class InnerModal extends Component<InnerModalProps, InnerModalState> {
    constructor(props: InnerModalProps) {
        super(props);
    }

    componentDidMount() {
        if (!containerMounted) {
            containerMounted = true;
        }
        $(document.body).append('<div id="inner-modal-container"></div>');
    }

    componentDidUpdate(prevProps: Readonly<InnerModalProps>, prevState: Readonly<InnerModalState>, snapshot?: any) {
        const {style, title, children, display, onClose} = this.props;
        if (!prevProps.display && display) {
            ReactDOM.render((
                <div className='proto-frameworks framework-inner-modal-mask' onClick={onClose}>
                    <div className='inner-modal' style={style}
                         onClick={e => e.stopPropagation()}>
                        {!!title && (
                            <div className='inner-modal-title'>
                                {title}
                                <Util.A className='inner-modal-close' onClick={onClose}>
                                    <CloseOutlined/>
                                </Util.A>
                            </div>
                        )}
                        <div className='inner-modal-body'>
                            {children}
                        </div>
                    </div>
                </div>
            ), document.getElementById('inner-modal-container'));
        }
        if (prevProps.display && !display) {
            ReactDOM.unmountComponentAtNode(document.getElementById('inner-modal-container'));
        }
    }

    render(): ReactNode {
        return null;
    }
}

export default InnerModal;
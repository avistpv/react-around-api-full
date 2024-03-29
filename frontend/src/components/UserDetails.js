import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';

const UserDetails = (props) => {
    const { handleLogout } = props;
    const [isOpen, setIsOpen] = React.useState(null);
    const currentUser = React.useContext(CurrentUserContext);

    useEffect(() => {
        setIsOpen(true);
        return () => setIsOpen(false);
    }, []);
    return (
        <div className={`header__user-details ${isOpen && 'header__user-details_type_opened'}`}>
            <span className="header__user-email">{currentUser.email}</span>
            <div className="header__user-link" onClick={handleLogout}>
                <Link to={'/signin'} className="header__link">
                    {'Log out'}
                </Link>
            </div>
        </div>
    );
};

export default UserDetails;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getDataUserById } from '../redux/userSlice/authActions';
import { getUserInformation, getToken } from '../utils/handelCookie';
import AccountActivationMessage from '../components/AccountActivationMessage';

/**
 * Middleware component to check account activation status
 * This component wraps the application and shows activation message when needed
 */
const AccountActivationMiddleware = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = getToken();

  // State to track if we should show the activation message
  const [shouldShowActivationMessage, setShouldShowActivationMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from Redux state
  const reduxUserData = useSelector((state) => state.auth?.dataUserById);

  // Get user data from cookies as fallback
  const cookieUserData = getUserInformation();

  // Define public routes that don't need activation check
  const publicRoutes = ['/', '/login', '/unauthorized', '/help-platform', '/all-category', '/about-page'];
  const isPublicRoute = publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/Product-Obsolete/') ||
    location.pathname.startsWith('/Product-Overview/');

  useEffect(() => {
    // Only fetch user data if we have a token and we're on a protected route
    if (token && !isPublicRoute) {
      setIsLoading(true);
      dispatch(getDataUserById(token));
    }
  }, [dispatch, token, isPublicRoute]);

  useEffect(() => {
    // Skip activation check for public routes
    if (isPublicRoute) {
      setShouldShowActivationMessage(false);
      setIsLoading(false);
      return;
    }

    // Skip activation check if no token (user not logged in)
    if (!token) {
      setShouldShowActivationMessage(false);
      setIsLoading(false);
      return;
    }

    // Check account activation status whenever user data changes
    const checkActivationStatus = () => {
      // Use Redux data if available, otherwise fall back to cookies
      const userData = reduxUserData || cookieUserData;

      if (!userData) {
        setShouldShowActivationMessage(false);
        setIsLoading(false);
        return;
      }

      // Check if user is system owner
      const isSystemOwner = userData.role === 'systemOwner';

      // Check if account is activated
      const isAccountActivated = userData.is_account_used === true || userData.is_account_used === 1;

      // Show activation message if user is not system owner and account is not activated
      const shouldShow = !isSystemOwner && !isAccountActivated;

      setShouldShowActivationMessage(shouldShow);
      setIsLoading(false);
    };

    checkActivationStatus();
  }, [reduxUserData, cookieUserData, isPublicRoute, token]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show activation message if needed
  if (shouldShowActivationMessage) {
    return <AccountActivationMessage />;
  }

  // Otherwise, render the application normally
  return children;
};

export default AccountActivationMiddleware;
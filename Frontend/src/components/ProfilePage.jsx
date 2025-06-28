import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Avatar, 
  Button, Divider, List, ListItem, 
  ListItemAvatar, ListItemText, Badge
} from '@mui/material';
import TaskTable from './Admin/TaskTable';
import { Email, Work } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from location state or localStorage
  const [userData, setUserData] = useState(() => {
    if (location.state?.user) {
      return location.state.user;
    }
    
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: 'Alex Morgan',
      role: 'Admin',
      email: 'alex.morgan@taskflowpro.com',
      avatar: 'A',
      userId: 'admin1'
    };
  });

  return (
    <Box className="profile-page" sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto' 
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            background: 'linear-gradient(90deg, #4f46e5 0%, #3a8dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {userData.role} Profile
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Card */}
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)', 
            mb: 3,
            flex: 1,
            minWidth: 350,
            maxWidth: 450
          }}>
            <CardContent sx={{ textAlign: 'center', pt: 4, pb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ 
                    bgcolor: '#4f46e5', 
                    width: 32, 
                    height: 32,
                    border: '2px solid white'
                  }}>
                    <Work fontSize="small" />
                  </Avatar>
                }
              >
                <Avatar sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: 48, 
                  bgcolor: '#4f46e5',
                  mb: 2,
                  mx: 'auto',
                  color: 'white'
                }}>
                  {userData.avatar}
                </Avatar>
              </Badge>
              
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {userData.name}
              </Typography>
              
              <List sx={{ width: '100%' }}>
                <ListItem sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  px: 0
                }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: '#eef2ff', 
                      width: 40, 
                      height: 40,
                      mb: 1
                    }}>
                      <Email sx={{ color: '#4f46e5' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      fontWeight: 600,
                      color: '#64748b'
                    }}
                    secondary={userData.email}
                    secondaryTypographyProps={{ 
                      sx: { 
                        textAlign: 'center',
                        fontWeight: 500,
                        color: '#1e293b'
                      } 
                    }}
                  />
                </ListItem>
              </List>
              
              <Typography variant="body2" sx={{ 
                color: '#4f46e5', 
                fontWeight: 700, 
                mb: 3,
                bgcolor: '#eef2ff',
                py: 1,
                px: 3,
                borderRadius: 4,
                display: 'inline-block'
              }}>
                {userData.role}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2, 
                mt: 3, 
                mb: 2 
              }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/assign')}
                  sx={{
                    fontWeight: 600,
                    borderWidth: '2px',
                    borderColor: '#cbd5e1',
                    color: '#1e293b',
                    '&:hover': {
                      borderColor: '#94a3b8',
                      backgroundColor: '#f1f5f9'
                    },
                    py: 1.2
                  }}
                >
                  Assign Task
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/team-management')}
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #4f46e5 0%, #3a8dff 100%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4338ca 0%, #2a7def 100%)',
                    },
                    py: 1.2
                  }}
                >
                  Team Management
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Task Table Section */}
          <Box sx={{ 
            flex: 2, 
            backgroundColor: 'white', 
            borderRadius: 3, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box component="span" sx={{ 
                  width: 6, 
                  height: 24, 
                  bgcolor: '#4f46e5', 
                  borderRadius: 1 
                }} />
                Task Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                View and manage your assigned tasks
              </Typography>
            </Box>
            <TaskTable />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
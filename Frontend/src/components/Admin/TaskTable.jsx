import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Avatar, Box, Chip, LinearProgress,
  IconButton, Button, Stack
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4caf50', '#2196f3', '#ff9800'];

const TaskTable = () => {
  const [projectSummary, setProjectSummary] = useState([]);
  const [rows, setRows] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [teamMemberFilter, setTeamMemberFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/task')
      .then(response => response.json())
      .then(data => {
        const formattedTasks = data.map(task => {
          let formattedDueDate = '';
          if (task.dueDate) {
            const date = new Date(task.dueDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDueDate = `${year}-${month}-${day}`;
          }

          return {
            ...task,
            id: task._id,
            assignee: {
              username: task.assignedToUsername || 'Unknown',
              userId: task.assignedToUserId || 'Unassigned',
              initials: (task.assignedToUsername || 'U').charAt(0).toUpperCase()
            },
            progress:
              ['done', 'completed'].includes(task.status?.toLowerCase()) ? 100 :
                task.status?.toLowerCase() === 'in-progress' ? 50 :
                  0,

            dueDate: formattedDueDate
          };
        });

        setRows(formattedTasks);

        const summary = {};
        formattedTasks.forEach(task => {
          if (task.projectName) {
            summary[task.projectName] = (summary[task.projectName] || 0) + 1;
          }
        });

        setProjectSummary(Object.entries(summary));
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'to-do': return 'primary';
      case 'in-progress': return 'info';
      case 'completed':
      case 'done': return 'success';
      default: return 'default';
    }
  };

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'to-do': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'done':
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleEdit = (id) => {
    navigate('/edit', { state: { taskId: id } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      fetch(`http://localhost:3000/task/${id}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            setRows(prev => prev.filter(row => row.id !== id));
          } else {
            console.error('Failed to delete task:', id);
          }
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const filteredRows = rows.filter(row =>
    (projectFilter === '' || row.projectId === projectFilter) &&
    (teamMemberFilter === '' || row.assignee.userId === teamMemberFilter)
  );

  const chartData = [
    {
      name: 'Completed',
      value: rows.filter(row => ['done', 'completed'].includes(row.status.toLowerCase())).length
    },
    {
      name: 'In Progress',
      value: rows.filter(row => row.status.toLowerCase() === 'in-progress').length
    },
    {
      name: 'Pending',
      value: rows.filter(row => row.status.toLowerCase() === 'to-do').length
    }
  ];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
      </Box>

      <Box mb={3} display="flex" justifyContent="center" alignItems="flex-start" gap={4}>
        <Box
          p={3}
          border="1px solid #d3d3d3"
          borderRadius="8px"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          backgroundColor="#f9f9f9"
          width="45%"
          minHeight="300px"
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="#3f51b5">
            Project-wise Task Summary
          </Typography>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {projectSummary.map(([project, count]) => (
              <li key={project} style={{ marginBottom: '8px' }}>
                <Typography>{`${count} tasks in "${project}"`}</Typography>
              </li>
            ))}
          </ul>
        </Box>

        <Box
          p={3}
          border="1px solid #d3d3d3"
          borderRadius="8px"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          backgroundColor="#f9f9f9"
          width="45%"
          minHeight="300px"
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="#3f51b5">
            Overview
          </Typography>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <Box mt={2}>
            {chartData.map((entry, index) => (
              <Typography key={index} variant="body2" style={{ color: COLORS[index] }}>
                {entry.name}: {entry.value}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <Typography variant="h6" gutterBottom>Filter Tasks</Typography>
        <Stack direction="row" spacing={2}>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '5px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none'
            }}
          >
            <option value="">All Projects</option>
            {Array.from(new Set(rows.map(row => row.projectId))).map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          <select
            value={teamMemberFilter}
            onChange={(e) => setTeamMemberFilter(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '5px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none'
            }}
          >
            <option value="">All Team Members</option>
            {Array.from(new Set(rows.map(row => row.assignee.userId))).map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="task table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#d3d3d3' }}>
              {['Project ID', 'Title', 'Assignee', 'Due Date', 'Priority', 'Status', 'Progress', 'Actions'].map(header => (
                <TableCell key={header} style={{ fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.projectId}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ color: '#A7C7E7', backgroundColor: '#F0FFFF' }}>
                      {row.assignee.initials}
                    </Avatar>
                    <Box>
                      <Typography>{row.assignee.username}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.assignee.userId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{row.dueDate}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: new Date(row.dueDate) < new Date() ? 'red' : 'gray',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {new Date(row.dueDate) < new Date() ? 'Overdue' : 'On Track'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.priority}
                    color={getPriorityColor(row.priority)}
                    size="small"
                    sx={{ width: 75, borderRadius: 7, fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatStatus(row.status)}
                    color={getStatusColor(row.status)}
                    size="small"
                    sx={{ width: 100, borderRadius: 7, fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={row.progress}
                      sx={{ height: 8, borderRadius: 5, width: 50 }}
                    />
                    <Typography variant="caption" color="text.secondary">{row.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(row.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-start" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRows.length} of {rows.length} tasks
        </Typography>
        <Box ml="auto">

        </Box>
      </Box>
    </div>
  );
};

export default TaskTable;
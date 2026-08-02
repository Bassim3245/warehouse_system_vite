import { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/GetApp";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import TerminalIcon from "@mui/icons-material/Terminal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LanguageIcon from "@mui/icons-material/Language";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import {useTheme} from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import { BackendUrFileLog } from "../../../redux/api/axios";

export default function Monitoring() {
  const theme = useTheme();
  const [logData, setLogData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [logType, setLogType] = useState("info"); // 'info' or 'error'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [dateFormat, setDateFormat] = useState("english"); // 'arabic' or 'english'

  // Helper function to convert English numbers to Arabic
  const toArabicNumbers = (str) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[0-9]/g, (digit) => arabicNumbers[parseInt(digit)]);
  };

  // Helper function to convert Arabic numbers to English
  const toEnglishNumbers = (str) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    let result = str;
    arabicNumbers.forEach((arabicDigit, index) => {
      result = result.replace(new RegExp(arabicDigit, "g"), index.toString());
    });
    return result;
  };

  // Format date based on selected format
  const formatDate = (year, month, format = dateFormat) => {
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, "0");

    if (format === "arabic") {
      return `${toArabicNumbers(yearStr)}-${toArabicNumbers(monthStr)}`;
    }
    return `${yearStr}-${monthStr}`;
  };

  // Generate the log URL based on the selected type, year, month and format
  const getLogUrl = () => {
    const formattedDate = formatDate(selectedYear, selectedMonth);
    return `${BackendUrFileLog}/${logType}-${formattedDate}.log`;
  };

  const logUrl = getLogUrl();

  // Helper function to get current year
  function getCurrentYear() {
    return new Date().getFullYear();
  }

  // Helper function to get current month (01-12)
  function getCurrentMonth() {
    return String(new Date().getMonth() + 1).padStart(2, "0");
  }

  const fetchLogData = async () => {
    setLoading(true);
    try {
      const response = await fetch(logUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      setLogData(text);
      setError(null);
    } catch (err) {
      console.error("Error fetching log data:", err);
      setError(`Failed to fetch log data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogData();

    // Set up auto-refresh if enabled
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchLogData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, logType, selectedYear, selectedMonth, dateFormat]); // Re-fetch when log type, year or month changes

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([logData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const formattedDate = formatDate(selectedYear, selectedMonth);
    element.download = `${logType}-${formattedDate}.log`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDateFormatChange = (event, newFormat) => {
    if (newFormat !== null) {
      setDateFormat(newFormat);
    }
  };

  // Generate an array of available years (current year and 4 previous years)
  const getAvailableYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push({
        value: year,
        label: year.toString(),
      });
    }

    return years;
  };

  // Generate an array of available months for the selected year
  const getAvailableMonths = () => {
    const months = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // If selected year is current year, only show months up to current month
    const monthLimit = selectedYear === currentYear ? currentMonth : 12;

    for (let i = 1; i <= monthLimit; i++) {
      const monthValue = String(i).padStart(2, "0");
      const monthNames = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ];
      months.push({
        value: monthValue,
        label: `${monthNames[i - 1]} (${monthValue})`,
      });
    }

    // Sort in descending order (most recent first)
    return months.reverse();
  };

  const availableYears = getAvailableYears();
  const availableMonths = getAvailableMonths();

  const handleLogTypeChange = (event, newType) => {
    if (newType !== null) {
      setLogType(newType);
    }
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);

    // Reset month selection if current selection is invalid for the new year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (newYear === currentYear && parseInt(selectedMonth) > currentMonth) {
      setSelectedMonth(String(currentMonth).padStart(2, "0"));
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Format log lines with color based on content
  const formatLogLine = (line) => {
    // Get colors based on current theme
    const errorColor = theme.palette.mode === "dark" ? "#ff5252" : "#e53935";
    const warningColor = theme.palette.mode === "dark" ? "#ffab40" : "#ff9800";
    const successColor = theme.palette.mode === "dark" ? "#69f0ae" : "#43a047";
    const infoColor = theme.palette.mode === "dark" ? "#40c4ff" : "#1976d2";
    const debugColor = theme.palette.mode === "dark" ? "#b388ff" : "#7e57c2";
    const timestampColor =
      theme.palette.mode === "dark" ? "#90caf9" : "#78909c";

    // Error formatting
    if (
      logType === "error" ||
      line.toLowerCase().includes("error") ||
      line.toLowerCase().includes("exception") ||
      line.toLowerCase().includes("fail")
    ) {
      return `<span style="color: ${errorColor};">${line}</span>`;
    }
    // Warning formatting
    else if (
      line.toLowerCase().includes("warn") ||
      line.toLowerCase().includes("warning")
    ) {
      return `<span style="color: ${warningColor};">${line}</span>`;
    }
    // Success formatting
    else if (
      line.toLowerCase().includes("success") ||
      line.toLowerCase().includes("completed")
    ) {
      return `<span style="color: ${successColor};">${line}</span>`;
    }
    // Info formatting
    else if (line.toLowerCase().includes("info")) {
      return `<span style="color: ${infoColor};">${line}</span>`;
    }
    // Debug formatting
    else if (line.toLowerCase().includes("debug")) {
      return `<span style="color: ${debugColor};">${line}</span>`;
    }
    // Timestamp formatting (assuming timestamps are at the beginning of lines)
    else if (line.match(/^\[?\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/)) {
      const parts = line.split(" ");
      if (parts.length > 1) {
        const timestamp = parts[0];
        const rest = parts.slice(1).join(" ");
        return `<span style="color: ${timestampColor};">${timestamp}</span> ${rest}`;
      }
    }

    // Default - no special formatting
    return line;
  };

  // Filter and format log data
  const filteredLogData = filter
    ? logData
      .split("\n")
      .filter((line) => line.toLowerCase().includes(filter.toLowerCase()))
      .map(formatLogLine)
      .join("\n")
    : logData.split("\n").map(formatLogLine).join("\n");

  return (
    <Box
      sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TerminalIcon
            sx={{
              fontSize: 28,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              animation: autoRefresh ? "pulse 2s infinite ease-in-out" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 0.7 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.7 },
              },
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              textShadow:
                theme.palette.mode === "dark"
                  ? `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`
                  : "none",
              letterSpacing: "0.5px",
            }}
          >
            System Logs Monitor
          </Typography>
          <Chip
            size="small"
            color={logType === "info" ? "info" : "error"}
            icon={logType === "info" ? <InfoIcon /> : <ErrorIcon />}
            label={logType === "info" ? "Info Logs" : "Error Logs"}
            sx={{ ml: 1, fontWeight: "medium" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            label="Filter logs"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                      : "none",
                },
                "&.Mui-focused": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`
                      : `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <FilterIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />
          <Tooltip title="Toggle auto-refresh (30s)">
            <Button
              variant={autoRefresh ? "contained" : "outlined"}
              color="primary"
              onClick={() => setAutoRefresh(!autoRefresh)}
              sx={{
                minWidth: "120px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                boxShadow:
                  autoRefresh && theme.palette.mode === "dark"
                    ? `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`
                    : "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 5px 10px ${alpha(theme.palette.common.black, 0.3)}`
                      : `0 5px 10px ${alpha(theme.palette.common.black, 0.1)}`,
                },
              }}
              startIcon={<VisibilityIcon />}
            >
              {autoRefresh ? "Auto (ON)" : "Auto (OFF)"}
            </Button>
          </Tooltip>
          <Tooltip title="Refresh logs">
            <IconButton
              onClick={fetchLogData}
              color="primary"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": { transform: "rotate(30deg)" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download log file">
            <IconButton
              onClick={handleDownload}
              color="primary"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
          p: 1.5,
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.4)
              : alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${theme.palette.mode === "dark"
              ? alpha(theme.palette.divider, 0.1)
              : theme.palette.divider
            }`,
        }}
      >
        <ToggleButtonGroup
          value={logType}
          exclusive
          onChange={handleLogTypeChange}
          aria-label="log type"
          size="small"
          color="primary"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: "8px",
              transition: "all 0.2s ease",
              fontWeight: "medium",
              "&.Mui-selected": {
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`
                    : `0 2px 5px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.primary.main, 0.04),
              },
            },
          }}
        >
          <ToggleButton value="info" aria-label="info logs">
            <InfoIcon sx={{ mr: 1 }} /> Info Logs
          </ToggleButton>
          <ToggleButton value="error" aria-label="error logs">
            <ErrorIcon sx={{ mr: 1 }} /> Error Logs
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.divider, 0.3)
                : theme.palette.divider,
          }}
        />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                      : "none",
                },
              },
            }}
          >
            <InputLabel id="year-select-label">السنة</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="السنة"
            >
              {availableYears.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                      : "none",
                },
              },
            }}
          >
            <InputLabel id="month-select-label">الشهر</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="الشهر"
            >
              {availableMonths.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={dateFormat}
            exclusive
            onChange={handleDateFormatChange}
            size="small"
          >
            <ToggleButton value="english" aria-label="english format">
              <LanguageIcon sx={{ mr: 1 }} />
              English (2025-06)
            </ToggleButton>
            <ToggleButton value="arabic" aria-label="arabic format">
              <LanguageIcon sx={{ mr: 1 }} />
              العربية (٢٠٢٥-٠٦)
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Paper
        elevation={theme.palette.mode === "dark" ? 8 : 3}
        sx={{
          p: 2,
          flexGrow: 1,
          height: "calc(100vh - 180px)",
          overflow: "auto",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
          position: "relative",
          transition: "all 0.3s ease",
          borderRadius: 1.5,
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              : "none",
          boxShadow:
            theme.palette.mode === "dark"
              ? `inset 0 0 15px ${alpha(theme.palette.primary.main, 0.1)}`
              : "none",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>
            <Typography variant="h6">Error</Typography>
            <Typography>{error}</Typography>
          </Box>
        ) : (
          <Box
            component="div"
            sx={{
              m: 0,
              p: 1.5,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              height: "100%",
              overflow: "auto",
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.text.primary
                  : "inherit",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.default, 0.7)
                  : alpha(theme.palette.background.paper, 0.7),
              borderRadius: 1,
              "& span": {
                fontFamily: "monospace",
                transition: "color 0.2s ease",
              },
            }}
            dangerouslySetInnerHTML={{
              __html:
                filteredLogData ||
                `<span style="color: ${theme.palette.mode === "dark" ? "#aaa" : "#777"
                }">No log data available</span>`,
            }}
          />
        )}
      </Paper>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.3)
              : alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            size="small"
            label={`${logType === "info" ? "Information" : "Error"} Logs`}
            color={logType === "info" ? "info" : "error"}
            variant="outlined"
            sx={{
              borderRadius: "4px",
              "& .MuiChip-label": { fontWeight: "medium" },
            }}
          />
          <Chip
            size="small"
            label={`${selectedYear}`}
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: "4px",
              "& .MuiChip-label": { fontWeight: "medium" },
            }}
          />
          <Chip
            size="small"
            label={
              availableMonths.find((m) => m.value === selectedMonth)?.label ||
              selectedMonth
            }
            color="secondary"
            variant="outlined"
            sx={{
              borderRadius: "4px",
              "& .MuiChip-label": { fontWeight: "medium" },
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.text.primary, 0.7)
                : theme.palette.text.secondary,
            fontWeight: "medium",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <RefreshIcon fontSize="small" />
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

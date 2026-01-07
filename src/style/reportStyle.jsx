import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Card, CardContent, Checkbox, Chip, Collapse, FormControlLabel, FormGroup, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Radio, Typography } from "@mui/material";
import React, { memo } from "react";
import { softColors } from "../constants/reportConstants";

export const CheckboxItem = memo(({ item, checked, onChange, color }) => (
    <FormControlLabel
        control={
            <Checkbox
                checked={checked}
                onChange={onChange}
                sx={{
                    color: color.light,
                    "&.Mui-checked": {
                        color: color.main,
                    },
                }}
            />
        }
        label={<Typography variant="body2">{item.name || item.title}</Typography>}
    />
));

// Memoized CollapsibleSection component
export const CollapsibleSection = memo(
    ({ title, icon, color, expanded, onToggle, children, emptyMessage, theme }) => {

        return (
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette[color].main}`,
                    height: "100%",
                }}
            >
                <List>
                    <ListItem button onClick={onToggle} sx={{ px: 0 }}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="h6"
                                    color={`${color}.main`}
                                    fontWeight="bold"
                                >
                                    {title}
                                </Typography>
                            }
                        />
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <FormGroup sx={{ pl: 4, maxHeight: "300px", overflowY: "auto" }}>
                            {children || (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ pl: 2, py: 1 }}
                                >
                                    {emptyMessage}
                                </Typography>
                            )}
                        </FormGroup>
                    </Collapse>
                </List>
            </Paper>
        );
    }
);

// Memoized ReportTypeOption component
export const ReportTypeOption = memo(({ option, selected, onChange, theme, t }) => {

    return (
        <Paper
            elevation={selected === option.value ? 3 : 1}
            sx={{
                p: 2,
                borderRadius: 2,
                border:
                    selected === option.value
                        ? `2px solid ${option.color}`
                        : "1px solid transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                    elevation: 2,
                    borderColor: option.color,
                },
            }}
        >
            <FormControlLabel
                value={option.value}
                control={
                    <Radio
                        sx={{
                            color: option.color,
                            "&.Mui-checked": {
                                color: option.color,
                            },
                        }}
                    />
                }
                label={
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%",
                        }}
                    >
                        <Box sx={{ color: option.color }}>{option.icon}</Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {option.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {option.description}
                            </Typography>
                        </Box>
                        {selected === option.value && (
                            <Chip
                                label={t("محدد")}
                                size="small"
                                sx={{
                                    backgroundColor: option.color,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            />
                        )}
                    </Box>
                }
                sx={{
                    margin: 0,
                    width: "100%",
                    "& .MuiFormControlLabel-label": {
                        width: "100%",
                    },
                }}
            />
        </Paper>
    );
});

// Memoized StatCard component to prevent unnecessary re-renders
export const StatCard = React.memo(({ stat, index }) => (
    <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: 3,
                backgroundColor: softColors.cardBg,
                border: `1px solid ${stat.color}20`,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 25px ${stat.color}20`,
                },
            }}
        >
            <CardContent sx={{ textAlign: "center", p: 2.5 }}>
                <Box
                    sx={{
                        display: "inline-flex",
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}15`,
                        mb: 1.5,
                    }}
                >
                    <stat.icon sx={{ fontSize: 28, color: stat.color }} />
                </Box>
                <Typography
                    variant={stat.isLarge ? "h6" : "h5"}
                    fontWeight="600"
                    color={softColors.neutral}
                    sx={{
                        mb: 0.5,
                        fontSize: stat.isLarge ? "1.1rem" : "1.5rem",
                        wordBreak: "break-word",
                    }}
                >
                    {stat.value}
                </Typography>
                <Typography
                    variant="body2"
                    color={softColors.neutral}
                    fontWeight="500"
                    sx={{ mb: 0.25 }}
                >
                    {stat.label}
                </Typography>
                <Typography variant="caption" color={softColors.neutral} opacity={0.6}>
                    {stat.subtitle}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
));

// Memoized QuickStat component
export const QuickStat = React.memo(({ stat }) => (
    <Grid size={6}>
        <Box sx={{ textAlign: "center" }}>
            <Typography
                variant="h4"
                color={stat.color}
                fontWeight="600"
                sx={{ mb: 0.5 }}
            >
                {stat.value}
            </Typography>
            <Typography variant="body2" color={softColors.neutral} opacity={0.8}>
                {stat.label}
            </Typography>
        </Box>
    </Grid>
));

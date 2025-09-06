import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useColorScheme } from "@mui/material";
import {
  LightMode,
  DarkModeOutlined,
  SettingsBrightness,
} from "@mui/icons-material";

const ThemeMode = () => {
  const { mode, setMode } = useColorScheme("light");

  const handleChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: "120px" }}>
      <InputLabel
        id="label-select-theme-mode"
        sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
      >
        Theme
      </InputLabel>
      <Select
        labelId="label-select-theme-mode"
        id="select-theme-mode"
        value={mode ?? ""}
        label="Theme"
        onChange={handleChange}
        sx={{
          color: "white",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          ".MuiSvgIcon-root": { color: "white" },
        }}
      >
        <MenuItem value="light">
          <div
            style={{
              display: "flex",
              textAlign: "center",
              gap: "8px",
            }}
          >
            <LightMode fontSize="small" /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
            <DarkModeOutlined fontSize="small" /> Dark
          </div>
        </MenuItem>
        <MenuItem value="system">
          <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
            <SettingsBrightness fontSize="small" /> System
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ThemeMode;

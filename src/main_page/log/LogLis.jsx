import { useSelector } from "react-redux";
import Header from "../../components/reusableComponent/HeaderComponent";
import GridTemplate from "../../components/reusableComponent/GridTemplet";
import { formatDate } from "../../utils/formatData";
import Loader from "../../components/reusableComponent/Loader";
import UseFullScreen from "../../hooks/useFullScreen";
import layoutStyle from "../../style/layoutStyle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const LogList = ({
  dataLog,
  totalItems,
  totalPages,
  loading,
  limit,
  page,
  setRefreshButton,
  setPage,
  setLimit,
  title,
  refreshButton,
}) => {
  const { rtl } = useSelector((state) => state?.language);

  const columns = [
    { field: "stagnant_id", headerName: "id", hideable: false },
    {
      field: "index",
      headerName: "#",
      width: 33,
      renderCell: (params) => params.index,
    },
    {
      field: "action",
      headerName: "نوع الحدث",
      width: 200,
    },
    {
      field: "text",
      headerName: "السجل",
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography> {params?.row?.text}</Typography>
            <span style={{ color: "#263238", fontWeight: "bold" }}>
              {" "}
              {formatDate(params?.row?.created_At)}
            </span>
          </div>
        );
      },
    },
  ];

  const rows = dataLog?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
  return (
    <Box sx={{ ...layoutStyle }}>
      {loading && <Loader />}
      <Box dir={"rtl"}>
        <Header title={title} dir={rtl?.dir} typeHeader={null} />
        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />

        <GridTemplate
          rows={rows}
          columns={columns}
          setPage={setPage}
          page={page}
          limit={limit}
          setLimit={setLimit}
          totalItems={totalItems}
          totalPages={totalPages}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default LogList;

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6c3fc5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#6c3fc5", textAlign: "center", marginTop: 16 },
  error: { color: "#c0392b", marginBottom: 12, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
});
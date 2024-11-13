import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginLogo from "../../assets/FSA-logo.png";
import { Button, Modal } from "antd"; // Ant Design Modal
import { loginFAMS } from "../../services/login"; // API loginFAMS

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [accessToken, setAccessToken] = useState(""); // Save the token
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Reset trạng thái lỗi
    setIsUsernameEmpty(false);
    setIsPasswordEmpty(false);
    setErrorMessage("");

    // Kiểm tra đầu vào rỗng
    if (!username) setIsUsernameEmpty(true);
    if (!password) setIsPasswordEmpty(true);
    if (!username || !password) return;

    setIsLoading(true);

    try {
      // Gọi API loginFAMS
      const response = await loginFAMS(username, password);

      // Debug phản hồi của API
      console.log("API Response:", response);

      // Nếu đăng nhập thành công với cấu trúc phản hồi đúng
      if (response && response.data) {
        const rolesString = response.data.roles; // Chuỗi roles
        const token = response.data.accessToken; // Lấy token từ API
        setAccessToken(token); // Lưu token
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('token', response.data.accessToken);

        // Chuyển chuỗi roles thành mảng
        const rolesArray = rolesString.split(",");

        // Gộp vai trò thành ADMIN nếu vai trò là FAMS_ADMIN, FA_MANAGER, hoặc CLASS_ADMIN
        const consolidatedRoles = rolesArray.map((role) =>
          ["FA_MANAGER", "CLASS_ADMIN"].includes(role)
            ? "CLASS_ADMIN"
            : role
        );

        // Nếu có nhiều vai trò, hiển thị Modal để chọn
        if (consolidatedRoles.length > 1) {
          setUserRoles(consolidatedRoles);
          setIsRoleModalVisible(true);
        } else {
          // Nếu chỉ có 1 vai trò, tiến hành đăng nhập thành công ngay
          const finalRole = consolidatedRoles[0];
          dispatchLoginAndNavigate(finalRole, token);
        }
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      // Bắt lỗi khi gọi API thất bại
      console.error("Login Error:", error);
      setErrorMessage("Login failed, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  const dispatchLoginAndNavigate = (role) => {
    localStorage.setItem('role', role);
    // Điều hướng dựa trên vai trò của người dùng
    if (role === "CLASS_ADMIN") {
      navigate("/CLASS_ADMIN");
    } else if (role === "TRAINER") {
      navigate("/TRAINER");
    } else if (role === "TRAINER_MANAGER") {
      navigate("/TRAINER_MANAGER");
    } else if (role === "DELIVERY_MANAGER") {
      navigate("/DELIVERY_MANAGER");
    } else if (role === "FAMS_ADMIN") {
      navigate("/FAMS_ADMIN");
    }
  };

  const handleRoleSelection = () => {
    if (selectedRole) {
      setIsRoleModalVisible(false);
      // Khi người dùng chọn vai trò, đăng nhập và điều hướng
      dispatchLoginAndNavigate(selectedRole, accessToken); // Truyền token đã lưu khi dispatch
    } else {
      setErrorMessage("Please select a role");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-full sm:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg mx-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src={LoginLogo}
            alt="FPT Software Academy"
            className="h-10 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">FPT Software</p>
        </div>

        {/* Input cho Username */}
        <div className="relative mb-4">
          <input
            type="text"
            className={`block w-full p-3 border ${isUsernameEmpty ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameEmpty(false);
            }}
          />
          {isUsernameEmpty && (
            <p className="text-red-500 text-sm mt-1">Username is required</p>
          )}
        </div>

        {/* Input cho Password */}
        <div className="relative mb-4">
          <input
            type="password"
            className={`block w-full p-3 border ${isPasswordEmpty ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordEmpty(false);
            }}
          />
          {isPasswordEmpty && (
            <p className="text-red-500 text-sm mt-1">Password is required</p>
          )}
        </div>

        {/* Modal chọn Role nếu có nhiều Role */}
        <Modal
          title="Select a Role"
          visible={isRoleModalVisible}
          onOk={handleRoleSelection}
          onCancel={() => setIsRoleModalVisible(false)}
          centered
        >
          <div className="space-y-2 sm:space-y-3">
            {userRoles.map((role) => (
              <label key={role} className="block">
                <input
                  type="radio"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-2"
                />
                {role}
              </label>
            ))}
          </div>
        </Modal>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        {/* Nút đăng nhập */}
        <button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none ${isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <div>
          <Link
            to="/FEEDBACK_LINK"
            className=" mt-4 flex items-center justify-center"
          >
            FeedBack Link
          </Link>
        </div>
      </div>

    </div>

  );
};

export default HomePage;

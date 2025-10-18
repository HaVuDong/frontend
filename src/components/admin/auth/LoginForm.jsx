import React from 'react';

const LoginForm = () => {
  return (
    <div className="p-4 bg-gray-100">
      <div className="hero bg-blue-900 rounded-lg shadow-lg">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white whitespace-nowrap ">Admin Panel</h1>
            <p className="text-gray-300 mt-2 font-bold">HÀ VŨ ĐÔNG</p>
          </div>
          <div className="card bg-white border border-blue-200 w-full max-w-sm shrink-0 shadow-xl rounded-lg">
            <div className="card-body">
              <fieldset className="fieldset space-y-4">
                <div>
                  <label className="label text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="label text-gray-700 font-medium">Password</label>
                  <input
                    type="password"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <a className="link link-hover text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                </div>
                <button className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-2">Login</button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Chưa có tài khoản?{" "}
                  <a href="/admin/auth/register" className="text-blue-600 font-semibold hover:text-blue-700">
                    Đăng ký
                  </a>
                </p>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

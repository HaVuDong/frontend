import React from 'react';

const RegisterForm = () => {
  return (
    <div className="p-4 bg-gray-100">
      <div className="hero bg-blue-900 rounded-lg shadow-lg">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white whitespace-nowrap ">Admin Registration</h1>
            <p className="text-gray-300 mt-2 font-bold">HÀ VŨ ĐÔNG</p>
          </div>
          <div className="card bg-white border border-blue-200 w-full max-w-sm shrink-0 shadow-xl rounded-lg">
            <div className="card-body">
              <fieldset className="fieldset space-y-4">
                <div>
                  <label className="label text-gray-700 font-medium">Full Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                </div>
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
                  <label className="label text-gray-700 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm Password"
                  />
                </div>
                <button className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-2">Register</button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Đã có tài khoản?{" "}
                  <a href="/admin/auth/login" className="text-blue-600 font-semibold hover:text-blue-700">
                    Đăng nhập
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

export default RegisterForm;

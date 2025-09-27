import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FilterByBrand({ setBrand }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách brand:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <select
      className="select select-success input-sm"
      defaultValue=""
      onChange={(e) => setBrand(e.target.value)}
    >
      <option disabled value="">-- Chọn thương hiệu --</option>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.name}>
          {brand.name}
        </option>
      ))}
    </select>
  );
}

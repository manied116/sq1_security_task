// VALIDATE INPUTS
export const validate = (formData) => {
    const newErrors = {};
    
    // NAME
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.length > 15) {
      newErrors.name = 'Name must be 15 characters or less';
    }

    // EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // EMPLOYEE ID
    if (!formData.empId) {
      newErrors.empId = 'Employee ID is required';
    } else if (formData.empId.length < 4) {
      newErrors.empId = 'Employee ID must be at least 4 characters';
    }

    // MOBILE
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be a valid 10-digit number';
    }

    // ROLE
    if (!formData.role) {
      newErrors.role = 'role is required';
    }
    return newErrors;
}
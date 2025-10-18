export default function generatePagination(currentPage, totalPages) {
    const pagination = [];
    const range = 2;
    if (currentPage > range + 1) {
        pagination.push(1);
    }
    for (let i = Math.max(1, currentPage - range); i <=
        Math.min(totalPages, currentPage + range); i++) {
        pagination.push(i);
    }

    if (currentPage < totalPages - range) {
        pagination.push(totalPages);
    }
    return pagination;
}

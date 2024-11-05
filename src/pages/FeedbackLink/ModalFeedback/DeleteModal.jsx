const DeleteModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                {/* Title */}
                <h2 className="text-red-600 font-bold text-lg">DELETE ALL ANSWERS</h2>
                <hr className="border-gray-300 my-4" />

                {/* Message */}
                <p className="text-[#000000] mb-6 text-xl font-semibold">
                    This action will remove your answer from all questions. You will not
                    be able to undo this action once you do it.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="text-[#000000] font-semibold hover:text-gray-900 text-xl"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onDelete}
                        className="bg-red-600 text-white px-14 rounded hover:bg-red-700"
                    >
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DeleteModal;
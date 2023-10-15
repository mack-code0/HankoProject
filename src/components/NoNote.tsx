import EmptyImage from "../assets/images/empty-folder.png"


export default function NoNote() {
    return <div className="w-full h-full flex flex-col items-center justify-center">
        <img className="opacity-50" src={EmptyImage} alt="" />
        <h6 className="font-inter text-2xl font-semibold text-white text-center text-opacity-50">No Note Yet! Please add a note</h6>
    </div>
}
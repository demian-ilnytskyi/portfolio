// "use client";

// interface BottomDialogCheckBoxProps {
//     id: string;
//     className: string;
//     formId: string;
// }

// export default function BottomDialogCheckBox({ id, className, formId }: BottomDialogCheckBoxProps) {
//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const isChecked = event.target.checked;
//         if (!isChecked) {
//             const form = document.getElementById(formId) as HTMLFormElement | null;
//             if (!form) return;

//             form.reset();
//         }
//     };


//     return <input
//         type="checkbox"
//         id={id}
//         className={className}
//         onChange={handleChange}
//     />
// }

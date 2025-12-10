// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::Manager;
// use tauri::Listener;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // let window = app.get_webview_window("main").unwrap();
            
            // Allow click-through on transparent areas by setting the window to be layered
            // This is complex on Windows. Tauri doesn't have a simple boolean for "click-through transparent pixels".
            // However, hittest transparency depends on mouse events.
            // If the HTML element has pointer-events: none, the webview might forward it.
            // But standard WebView2 behavior usually captures all clicks.
            
            #[cfg(target_os = "windows")]
            {
               // We might need to handle WM_NCHITTEST if simple CSS pointer-events isn't enough.
               // But usually simply setting the window to transparent allows clicks to pass through 
               // IF the webview decides not to handle them.
               // Let's ensure the background color is fully transparent.
            }
            
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

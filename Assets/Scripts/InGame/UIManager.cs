using UnityEngine;
using System.Collections;

public class UIManager : MonoBehaviour {

    public Animator quitButton;

	void Start () {}
	
	void Update () 
    {
	    if(Input.GetKeyDown(KeyCode.Escape))
        {
            quitButton.enabled = true;
            if (quitButton.GetBool("isHidden")) quitButton.SetBool("isHidden", false);
            else quitButton.SetBool("isHidden", true);
        }
	}

    public void QuitClicked()
    {
        Application.LoadLevel("Opening Scene");
    }
}
